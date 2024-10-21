import TaskState from "../interfaces/TaskState";

const initialTaskState: TaskState = {
  readyToDo: [],
  blocked: [],
  inProgress: [],
  testing: [],
  done: [],
};

export default initialTaskState;
