interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  assignedUserId: number;
}

export default Task;
