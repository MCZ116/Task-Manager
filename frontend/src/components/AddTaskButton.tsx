import React from "react";
import "../styles/AddTaskBtn.css";
import AddIcon from "../assets/plus-square-fill.svg";

interface AddTaskButton {
  onAddTask: () => void;
}

const AddTaskButton: React.FC<AddTaskButton> = ({ onAddTask }) => {
  const handleAddTask = () => {
    onAddTask();
  };

  return (
    <button type="button" className="btn btn-primary" onClick={handleAddTask}>
      <img src={AddIcon} alt="add task icon" className="plus-icon" /> Add
    </button>
  );
};

export default AddTaskButton;
