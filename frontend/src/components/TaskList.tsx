import React from "react";
import TaskItem from "./TaskItem";
import Task from "../models/Task";
import "../styles/TaskList.css";
import { Draggable } from "@hello-pangea/dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import AddTaskButton from "./AddTaskButton";

interface TaskListProps {
  readyToDo: Task[];
  onEdit: (task: Task) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  readyToDo,
  onEdit,
  onAddTask,
}) => {
  return (
    <StrictModeDroppable droppableId="readyToDo">
      {(provided) => (
        <div
          className="ready-to-do"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="column-header">
            <h5>To Do </h5>
            <AddTaskButton onAddTask={onAddTask} />
          </div>
          <hr />
          {readyToDo.map((task, index) => (
            <Draggable
              draggableId={task.id.toString()}
              key={task.id}
              index={index}
            >
              {(provided) => (
                <div
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                >
                  <TaskItem key={task.id} task={task} onEdit={onEdit} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default TaskList;
