import React, { useState } from "react";
import Task from "../models/Task";
import "../styles/TaskForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseButton from "./CloseButton";
import TaskDropDownMenu from "./TaskDropdownMenu";
import TaskState from "../models/TaskState";
import initialTaskState from "../models/InitialTaskState";
import { formatDateToDMYString } from "../utility/DateFormatter";
import axiosInstance from "./axiosInstance";

const TASKS_API_URL = "/tasks";

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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prevState) => ({
        ...prevState,
        dueDate: date,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.dueDate) {
      setErrorMessage("Please select a due date.");
      return;
    }
    try {
      const formattedDate = formatDateToDMYString(formData.dueDate);
      const response = await axiosInstance.post(TASKS_API_URL, {
        ...formData,
        dueDate: formattedDate,
      });
      onSave(response.data, initialTaskState);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
            selected={formData.dueDate}
            onChange={handleDateChange}
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
