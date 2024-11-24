import Task from "../interfaces/Task";

export const updateTaskStateForNewTask = (
  savedTask: Task,
  setTaskState: any
) => {
  setTaskState((prevState: any) => ({
    ...prevState,
    readyToDo: [savedTask, ...prevState.readyToDo],
  }));
};

export const updateTaskStateForExistingTask = (
  savedTask: Task,
  columnKey: any,
  setTaskState: any
) => {
  setTaskState((prevState: any) => ({
    ...prevState,
    [columnKey]: prevState[columnKey].map((task: Task) =>
      task.id === savedTask.id ? savedTask : task
    ),
  }));
};

export const updateTaskStateForDeleting = (
  taskId: number,
  setTaskState: any
) => {
  setTaskState((prevState: any) => {
    const updatedState = Object.fromEntries(
      Object.entries(prevState).map(([columnName, tasks]) => [
        columnName,
        (tasks as Task[]).filter((task) => task.id !== taskId),
      ])
    );
    return updatedState;
  });
};

export const setTasksForColumn = (
  columnId: string,
  updatedTasks: Task[],
  setTaskState: any
) => {
  setTaskState((prevTaskState: any) => ({
    ...prevTaskState,
    [columnId]: updatedTasks,
  }));
};
