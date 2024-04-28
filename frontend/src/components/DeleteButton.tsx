import React from "react";
import "../styles/Button.css";
import DeleteIcon from "../assets/trash.svg";

interface DeleteButton {
  onDeleteTask: () => void;
}

const DeleteButton: React.FC<DeleteButton> = ({ onDeleteTask }) => {
  const handleDeleteTask = () => {
    onDeleteTask();
  };

  return (
    <button type="button" className="dropdown-item" onClick={handleDeleteTask}>
      Delete
      <img src={DeleteIcon} alt="delete task icon" className="delete-icon" />
    </button>
  );
};

export default DeleteButton;
