import TaskState from "./TaskState";

const initialTaskState: TaskState = {
  readyToDo: [],
  blocked: [],
  inProgress: [],
  testing: [],
  done: [],
};

export default initialTaskState;
