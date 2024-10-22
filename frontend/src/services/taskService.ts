import Task from "../interfaces/Task";
import axiosInstance from "../utility/axiosInstance";

const TASKS_API_URL = "/tasks";

export const getAllTask = async () => {
  const response = await axiosInstance.get<Task[]>(TASKS_API_URL);
  return response.data;
};

export const addNewTask = async (task: Task) => {
  const response = await axiosInstance.post<Task>(TASKS_API_URL, task);
  return response.data;
};

export const editTask = async (task: Task) => {
  const response = await axiosInstance.put(`${TASKS_API_URL}/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (taskId: number) => {
  await axiosInstance.delete(`${TASKS_API_URL}/${taskId}`);
};
