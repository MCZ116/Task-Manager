import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import axios from "axios";
import "./App.css";
import "./styles/TaskTable.css";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskTable from "./components/TaskTable";
import Task from "./utility/Task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blocked, setBlocked] = useState<Task[]>([]);
  const [inProgress, setProgress] = useState<Task[]>([]);
  const [testing, setTesting] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("http://localhost:8080/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
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
        setTasks((prevTasks) => [...prevTasks, savedTask]);
      }
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
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragDrop = (results: DropResult) => {
    const { source, destination } = results;

    if (!destination) return;

    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (sourceColumnId === destinationColumnId) {
      const updatedTasks = reorder(
        getTasks(sourceColumnId),
        source.index,
        destination.index
      );
      setTasksForColumn(sourceColumnId, updatedTasks);
    } else {
      const sourceTasks = Array.from(getTasks(sourceColumnId));
      const destinationTasks = Array.from(getTasks(destinationColumnId));
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);
      setTasksForColumn(sourceColumnId, sourceTasks);
      setTasksForColumn(destinationColumnId, destinationTasks);
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
      <Sidebar onAddTask={handleAddTask} />
      <div className="content">
        {showTaskForm && (
          <TaskForm
            task={
              editingTask || { id: 0, name: "", description: "", dueDate: "" }
            }
            onSave={handleSaveTask}
            onClose={handleCloseTaskForm}
          />
        )}

        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        <TaskTable
          blocked={blocked}
          progress={inProgress}
          testing={testing}
          done={done}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DragDropContext>
  );
}

export default App;
