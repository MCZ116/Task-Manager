import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import axios from "axios";
import "./App.css";
import "./styles/TaskTable.css";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskTable from "./components/TaskTable";
import Task from "./models/Task";
import TaskColumnOrder from "./models/TaskColumnOrder";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blocked, setBlocked] = useState<Task[]>([]);
  const [inProgress, setProgress] = useState<Task[]>([]);
  const [testing, setTesting] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksResponse = await axios.get<Task[]>(
        "http://localhost:8080/tasks"
      );
      const columnOrderResponse = await axios.get<TaskColumnOrder[]>(
        "http://localhost:8080/tasksColumnOrder"
      );

      // Distribute tasks among columns based on the column order information
      distributeTasksToColumns(tasksResponse.data, columnOrderResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const distributeTasksToColumns = (
    tasks: Task[],
    columnOrder: TaskColumnOrder[]
  ) => {
    console.log(columnOrder);
    const newBlocked: Task[] = [];
    const newProgress: Task[] = [];
    const newTesting: Task[] = [];
    const newDone: Task[] = [];
    const readyToDo: Task[] = [];

    tasks.forEach((task) => {
      const order = columnOrder.find((item) => item.taskId === task.id);

      console.log("test " + order?.taskId);
      if (order) {
        switch (order.columnName) {
          case "blocked":
            newBlocked.splice(order.index, 0, task);
            break;
          case "in-progress":
            newProgress.splice(order.index, 0, task);
            break;
          case "testing":
            newTesting.splice(order.index, 0, task);
            break;
          case "done":
            console.log(order.index + "move done");
            newDone.splice(order.index, 0, task);
            break;
          default:
            readyToDo.splice(order.index, 0, task);
            break;
        }
      } else {
        console.warn(`No order found for task with ID ${task.id}`);
      }
    });

    // Update state with the new task distributions
    setBlocked(newBlocked);
    setProgress(newProgress);
    setTesting(newTesting);
    setDone(newDone);
    setTasks(readyToDo);
  };

  const handleAddTask = () => {
    setShowTaskForm(true);
    setEditingTask({ id: 0, name: "", description: "", dueDate: "" });
  };

  const handleEdit = (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setShowTaskForm(true);
    }
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      let response;
      if (editingTask?.id !== 0) {
        response = await axios.put(
          `http://localhost:8080/tasks/${updatedTask.id}`,
          updatedTask
        );
      } else {
        response = await axios.post<Task>(
          "http://localhost:8080/tasks",
          updatedTask
        );
      }

      const savedTask = response.data;
      if (editingTask?.id !== 0) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
        );
      } else {
        setTasks([savedTask, ...tasks]);
      }
      saveTaskPosition(savedTask.id, "task-list", 0);
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    try {
      await axios.delete(`http://localhost:8080/tasks/${taskId}`);
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

    // Extract the moved task from the source column
    const movedTask = getTasks(sourceColumnId)[source.index];

    // Update the local state based on the drag and drop action
    if (sourceColumnId === destinationColumnId) {
      const updatedTasks = reorder(
        getTasks(sourceColumnId),
        source.index,
        destination.index
      );
      setTasksForColumn(sourceColumnId, updatedTasks);

      const changedPositionTask = updatedTasks[source.index];

      saveTaskPosition(
        changedPositionTask.id,
        destinationColumnId,
        source.index
      );
    } else {
      const sourceTasks = Array.from(getTasks(sourceColumnId));
      const destinationTasks = Array.from(getTasks(destinationColumnId));
      sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);
      setTasksForColumn(sourceColumnId, sourceTasks);
      setTasksForColumn(destinationColumnId, destinationTasks);

      for (let i = source.index; i < sourceTasks.length; i++) {
        saveTaskPosition(sourceTasks[i].id, sourceColumnId, i);
      }

      for (let i = destination.index; i < destinationTasks.length; i++) {
        saveTaskPosition(destinationTasks[i].id, destinationColumnId, i);
      }
    }
    console.log(destination.index);
    saveTaskPosition(movedTask.id, destinationColumnId, destination.index);
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
      await axios.post("http://localhost:8080/tasksColumnOrder", postData);
    } catch (error) {
      console.error("Error updating task order:", error);
    }
  };

  const getTasks = (columnId: string): Task[] => {
    console.log(columnId);
    switch (columnId) {
      case "blocked":
        return blocked;
      case "in-progress":
        return inProgress;
      case "testing":
        return testing;
      case "done":
        return done;
      default:
        return tasks;
    }
  };

  const setTasksForColumn = (columnId: string, updatedTasks: Task[]) => {
    console.log(columnId);
    switch (columnId) {
      case "blocked":
        setBlocked(updatedTasks);
        break;
      case "in-progress":
        setProgress(updatedTasks);
        break;
      case "testing":
        setTesting(updatedTasks);
        break;
      case "done":
        setDone(updatedTasks);
        break;
      default:
        setTasks(updatedTasks);
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
      <Sidebar />
      <div className="content">
        {showTaskForm && (
          <TaskForm
            task={
              editingTask || { id: 0, name: "", description: "", dueDate: "" }
            }
            onSave={handleSaveTask}
            onClose={handleCloseTaskForm}
            onDelete={handleDelete}
          />
        )}

        <TaskList tasks={tasks} onEdit={handleEdit} onAddTask={handleAddTask} />
        <TaskTable
          blocked={blocked}
          progress={inProgress}
          testing={testing}
          done={done}
          onEdit={handleEdit}
        />
      </div>
    </DragDropContext>
  );
}

export default App;
