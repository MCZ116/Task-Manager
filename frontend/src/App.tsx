import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import Task from './utility/Task';
import TaskForm from './components/TaskForm';
import './App.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:8080/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = () => {
    setShowTaskForm(true);
    setEditingTask({ id: 0, name: '', description: '', dueDate: '' }); 
  };

  const handleEdit = (taskId: number) => {
    
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit); 
      setShowTaskForm(true); 
    }
  };


  const handleSaveTask = async (updatedTask: Task) => {
    try {
      let response;
      if (editingTask?.id !== 0) {
        response = await axios.put(`http://localhost:8080/tasks/${updatedTask.id}`, updatedTask);
      } else {
        response = await axios.post<Task>('http://localhost:8080/tasks', updatedTask);
      }
      
      const savedTask = response.data;
      if (editingTask?.id !== 0) {
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === savedTask.id ? savedTask : task))
        );
      } else {
        setTasks(prevTasks => [...prevTasks, savedTask]);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  

  const handleCloseTaskForm = () => {
    setShowTaskForm(false); 
    setEditingTask(null); 
  };

  const handleDelete = async (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);

    try {
      await axios.delete(`http://localhost:8080/tasks/${taskId}`);

    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <>
      <Sidebar onAddTask={handleAddTask} />
      <div className="content">
      {showTaskForm && (
        <TaskForm task={editingTask || { id: 0, name: '', description: '', dueDate: '' }} 
        onSave={handleSaveTask} onClose={handleCloseTaskForm} />
      )}
      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
    </>
  );
}

export default App;
