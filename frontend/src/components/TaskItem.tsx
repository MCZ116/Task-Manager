import React from "react";
import "../styles/TaskItem.css";
import Task from "../models/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const handleEditClick = () => {
    onEdit(task.id);
  };

  return (
    <div className="task-item" onClick={handleEditClick}>
      <div>Title: {task.name}</div>
      <div>Description: {task.description}</div>
      <div>Due Date: {task.dueDate}</div>
    </div>
  );
};
export default TaskItem;
