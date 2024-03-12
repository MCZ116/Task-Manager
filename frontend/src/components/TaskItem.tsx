import React from "react";
import "../styles/TaskItem.css";
import Task from "../models/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const handleEditClick = () => {
    onEdit(task.id);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <div className="task-item">
      <div>Name: {task.name}</div>
      <div>Description: {task.description}</div>
      <div>Due Date: {task.dueDate}</div>
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};
export default TaskItem;
