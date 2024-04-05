import React, { useState } from "react";
import Task from "../models/Task";
import "../styles/TaskForm.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseButton from "./CloseButton";
import TaskDropDownMenu from "./TaskDropdownMenu";
import TaskState from "../models/TaskState";
import initialTaskState from "../models/InitialTaskState";

const TASKS_API_URL = "http://localhost:8080/tasks";

interface TaskFormProps {
  task: Task;
  onSave: (updatedTask: Task, taskState: TaskState) => void;
  onClose: () => void;
  onDelete: (taskId: number, taskState: TaskState) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSave,
  onClose,
  onDelete,
}) => {
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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      const response = await axios.post<Task>(TASKS_API_URL, updatedTask);
      onSave(response.data, initialTaskState);
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

  const handleDeleteClick = () => {
    onDelete(task.id, initialTaskState);
  };

  return (
    <div className="task-form">
      <CloseButton onClose={onClose} />
      <TaskDropDownMenu onDelete={handleDeleteClick} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextAreaChange}
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
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
