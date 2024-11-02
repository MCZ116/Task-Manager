import Task from "../interfaces/Task";

export const defaultTask: Task = {
  id: 0,
  name: "",
  description: "",
  dueDate: new Date(),
  assignedUserId: 0,
};
