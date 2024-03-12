import React, { useState } from "react";
import Task from "../models/Task";
import "../styles/TaskForm.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TaskFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState<Task>({ ...task });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) {
      setErrorMessage("Please select a due date.");
      return;
    }
    try {
      const formattedDate = formatDate(dueDate);
      const updatedTask = { ...formData, dueDate: formattedDate };
      const response = await axios.post<Task>(
        "http://localhost:8080/tasks",
        updatedTask
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="task-form">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Due Date:</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="dd/MM/yyyy"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <button className="rounded-button" type="submit">
          Save
        </button>
        <button className="rounded-button" type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
