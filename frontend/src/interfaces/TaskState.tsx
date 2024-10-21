import Task from "./Task";

interface TaskState {
  [key: string]: Task[];
  readyToDo: Task[];
  blocked: Task[];
  inProgress: Task[];
  testing: Task[];
  done: Task[];
}

export default TaskState;
