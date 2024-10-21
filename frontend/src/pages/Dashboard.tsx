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
import axiosInstance from "../utility/axiosInstance";
import { fetchUsers } from "../services/userService";

const TASKS_API_URL = "/tasks";
const TASKS_COLUMN_ORDER_API_URL = "/tasksColumnOrder";

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
      const tasksResponse = await axiosInstance.get<Task[]>(TASKS_API_URL);
      const columnOrderResponse = await axiosInstance.get<TaskColumnOrder[]>(
        TASKS_COLUMN_ORDER_API_URL
      );
      distributeTasksToColumns(tasksResponse.data, columnOrderResponse.data);
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
      id: 0,
      name: "",
      description: "",
      dueDate: new Date(),
      assignedUserId: 0,
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
        const response = await axiosInstance.post<Task>(
          TASKS_API_URL,
          updatedTask
        );
        const savedTask = response.data;

        setTaskState((prevState) => ({
          ...prevState,
          readyToDo: [savedTask, ...prevState.readyToDo],
        }));
        saveTaskPosition(savedTask.id, "readyToDo", 0);
      } else {
        const response = await axiosInstance.put(
          `${TASKS_API_URL}/${updatedTask.id}`,
          updatedTask
        );
        const savedTask = response.data;

        const taskColumnOrderResponse =
          await axiosInstance.get<TaskColumnOrder>(
            `${TASKS_COLUMN_ORDER_API_URL}/${updatedTask.id}`
          );
        const editedTask = taskColumnOrderResponse.data;
        const columnKey = determineColumnKey(editedTask.columnName);

        setTaskState((prevState) => ({
          ...prevState,
          [columnKey]: prevState[columnKey].map((task) =>
            task.id === savedTask.id ? savedTask : task
          ),
        }));
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
      await axiosInstance.delete(`${TASKS_API_URL}/${taskId}`);

      setTaskState((prevState) => {
        const updatedState: TaskState = { ...prevState };
        Object.keys(updatedState).forEach((columnName) => {
          if (Array.isArray(updatedState[columnName])) {
            updatedState[columnName as keyof TaskState] = (
              updatedState[columnName as keyof TaskState] as Task[]
            ).filter((task) => task.id !== taskId);
          }
        });
        return updatedState;
      });

      setShowTaskForm(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragDrop = async (results: DropResult) => {
    const { source, destination } = results;

    if (!destination) return;

    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const movedTask = getTasks(sourceColumnId, taskState)[source.index];

    if (sourceColumnId === destinationColumnId) {
      const updatedTasks = reorder(
        getTasks(sourceColumnId, taskState),
        source.index,
        destination.index
      );
      setTasksForColumn(sourceColumnId, updatedTasks);

      updatedTasks.forEach((task, index) => {
        saveTaskPosition(task.id, sourceColumnId, index);
      });
    } else {
      const sourceTasks = Array.from(getTasks(sourceColumnId, taskState));
      const destinationTasks = Array.from(
        getTasks(destinationColumnId, taskState)
      );
      sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      setTasksForColumn(sourceColumnId, sourceTasks);
      setTasksForColumn(destinationColumnId, destinationTasks);

      destinationTasks.forEach((task, index) => {
        saveTaskPosition(task.id, destinationColumnId, index);
      });
    }
  };

  const saveTaskPosition = async (
    taskId: number,
    columnName: string,
    index: number
  ) => {
    const postData = {
      taskId: taskId,
      columnName: columnName,
      index: index,
    };

    try {
      await axiosInstance.post(TASKS_COLUMN_ORDER_API_URL, postData);
    } catch (error) {
      console.error("Error updating task order:", error);
    }
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

  const setTasksForColumn = (columnId: string, updatedTasks: Task[]) => {
    setTaskState((prevTaskState) => ({
      ...prevTaskState,
      [columnId]: updatedTasks,
    }));
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
      <Sidebar />
      <div className="content">
        {showTaskForm && (
          <TaskForm
            task={
              editingTask || {
                id: 0,
                name: "",
                description: "",
                dueDate: new Date(),
                assignedUserId: 0,
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
        />
        <TaskTable
          blocked={taskState.blocked}
          progress={taskState.inProgress}
          testing={taskState.testing}
          done={taskState.done}
          onEdit={handleEdit}
        />
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
