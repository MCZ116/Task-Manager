import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import "../App.css";
import "../styles/TaskTable.css";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import Task from "../interfaces/Task";
import TaskColumnOrder from "../interfaces/TaskColumnOrder";
import TaskState from "../interfaces/TaskState";
import initialTaskState from "../state/InitialTaskState";
import { formatDateAsDMY } from "../utility/DateFormatter";
import { fetchUsers } from "../services/userService";
import {
  addNewTask,
  deleteTask,
  editTask,
  getAllTask,
} from "../services/taskService";
import {
  getAllTasksPosition,
  getTaskPosition,
  saveTaskPosition,
} from "../services/taskColumnOrderService";
import {
  setTasksForColumn,
  updateTaskStateForDeleting,
  updateTaskStateForExistingTask,
  updateTaskStateForNewTask,
} from "../state/taskState";
import { defaultTask } from "../constants/defaultTask";

const Dashboard: React.FC = () => {
  const [taskState, setTaskState] = useState<TaskState>(initialTaskState);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUser(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    loadUsers();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksResponse = await getAllTask();
      const columnOrderResponse = await getAllTasksPosition();
      distributeTasksToColumns(tasksResponse, columnOrderResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const distributeTasksToColumns = (
    tasks: Task[],
    columnOrder: TaskColumnOrder[]
  ) => {
    const columnTasksMap: { [key: string]: Task[] } = {};

    Object.keys(initialTaskState).forEach((columnName) => {
      columnTasksMap[columnName] = [];
    });

    const tasksByColumn: { [key: string]: Task[] } = {};
    tasks.forEach((task) => {
      const order = columnOrder.find((item) => item.taskId === task.id);
      const columnName = order?.columnName || "readyToDo"; // Default to 'readyToDo' if no order found

      if (!tasksByColumn[columnName]) {
        tasksByColumn[columnName] = [];
      }
      tasksByColumn[columnName].push(task);
    });

    Object.keys(tasksByColumn).forEach((columnName) => {
      const tasksInColumn = tasksByColumn[columnName];
      tasksInColumn.sort((taskA, taskB) => {
        const orderA = columnOrder.find((item) => item.taskId === taskA.id);
        const orderB = columnOrder.find((item) => item.taskId === taskB.id);
        return (orderA?.index || 0) - (orderB?.index || 0);
      });
      columnTasksMap[columnName] = tasksInColumn;
    });

    setTaskState((prevState) => ({
      ...prevState,
      ...columnTasksMap,
    }));
  };

  const handleAddTask = () => {
    setShowTaskForm(true);
    setEditingTask({
      ...defaultTask,
    });
  };

  const handleEdit = (task: Task) => {
    const formattedDate = formatDateAsDMY(task.dueDate);
    setEditingTask((prevState) => ({
      ...prevState,
      ...task,
      dueDate: formattedDate,
    }));
    setShowTaskForm(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      const isNewTask = editingTask?.id === 0;

      if (isNewTask) {
        const savedTask = await addNewTask(updatedTask);

        updateTaskStateForNewTask(savedTask, setTaskState);
        saveTaskPosition(savedTask.id, "readyToDo", 0);
      } else {
        const savedTask = await editTask(updatedTask);
        const editedTask = await getTaskPosition(updatedTask);
        const columnKey = determineColumnKey(editedTask.columnName);

        updateTaskStateForExistingTask(savedTask, columnKey, setTaskState);
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const determineColumnKey = (
    status: string
  ): keyof typeof initialTaskState => {
    switch (status) {
      case "blocked":
        return "blocked";
      case "inProgress":
        return "inProgress";
      case "testing":
        return "testing";
      case "done":
        return "done";
      default:
        return "readyToDo";
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      updateTaskStateForDeleting(taskId, setTaskState);
      setShowTaskForm(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragDrop = async (results: DropResult) => {
    const { source, destination } = results;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    const movedTask = getTasks(sourceColumnId, taskState)[source.index];

    if (sourceColumnId === destinationColumnId) {
      handleReorderInSameColumn(
        sourceColumnId,
        source.index,
        destination.index
      );
    } else {
      handleMoveBetweenColumns(
        sourceColumnId,
        destinationColumnId,
        source.index,
        destination.index,
        movedTask
      );
    }
  };

  const handleReorderInSameColumn = (
    columnId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    const updatedTasks = reorder(
      getTasks(columnId, taskState),
      fromIndex,
      toIndex
    );
    setTasksForColumn(columnId, updatedTasks, setTaskState);
    updateTaskPositions(updatedTasks, columnId);
  };

  const handleMoveBetweenColumns = (
    sourceColumnId: string,
    destinationColumnId: string,
    fromIndex: number,
    toIndex: number,
    movedTask: Task
  ) => {
    const sourceTasks = [...getTasks(sourceColumnId, taskState)];
    const destinationTasks = [...getTasks(destinationColumnId, taskState)];

    sourceTasks.splice(fromIndex, 1);
    destinationTasks.splice(toIndex, 0, movedTask);

    setTasksForColumn(sourceColumnId, sourceTasks, setTaskState);
    setTasksForColumn(destinationColumnId, destinationTasks, setTaskState);

    updateTaskPositions(destinationTasks, destinationColumnId);
  };

  const updateTaskPositions = (tasks: Task[], columnId: string) => {
    tasks.forEach((task, index) => saveTaskPosition(task.id, columnId, index));
  };

  const getTasks = (
    columnId: string,
    taskState: typeof initialTaskState
  ): Task[] => {
    switch (columnId) {
      case "blocked":
        return taskState.blocked;
      case "inProgress":
        return taskState.inProgress;
      case "testing":
        return taskState.testing;
      case "done":
        return taskState.done;
      default:
        return taskState.readyToDo;
    }
  };

  const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
  ): Task[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={handleDragDrop}>
      <div className="content">
        <Sidebar />
        {showTaskForm && (
          <TaskForm
            task={
              editingTask || {
                ...defaultTask,
              }
            }
            user={user}
            onSave={handleSaveTask}
            onClose={handleCloseTaskForm}
            onDelete={handleDelete}
          />
        )}

        <TaskList
          readyToDo={taskState.readyToDo}
          onEdit={handleEdit}
          onAddTask={handleAddTask}
          user={user}
        />
        <TaskTable
          blocked={taskState.blocked}
          progress={taskState.inProgress}
          testing={taskState.testing}
          done={taskState.done}
          onEdit={handleEdit}
          user={user}
        />
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
