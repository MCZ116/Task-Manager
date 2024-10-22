import Task from "../interfaces/Task";
import TaskColumnOrder from "../interfaces/TaskColumnOrder";
import axiosInstance from "../utility/axiosInstance";

const TASKS_COLUMN_ORDER_API_URL = "/tasksColumnOrder";

export const getAllTasksPosition = async (): Promise<TaskColumnOrder[]> => {
  const response = await axiosInstance.get<TaskColumnOrder[]>(
    TASKS_COLUMN_ORDER_API_URL
  );
  return response.data;
};

export const getTaskPosition = async (task: Task) => {
  const response = await axiosInstance.get<TaskColumnOrder>(
    `${TASKS_COLUMN_ORDER_API_URL}/${task.id}`
  );
  return response.data;
};

export const saveTaskPosition = async (
  taskId: number,
  columnName: string,
  index: number
) => {
  await axiosInstance.post(TASKS_COLUMN_ORDER_API_URL, {
    taskId,
    columnName,
    index,
  });
};
