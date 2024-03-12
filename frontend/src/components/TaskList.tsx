import React from "react";
import TaskItem from "./TaskItem";
import Task from "../models/Task";
import "../styles/TaskList.css";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface TaskListProps {
  tasks: Task[];
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  return (
    <StrictModeDroppable droppableId="task-list">
      {(provided) => (
        <div
          className="task-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h3>To Do</h3>
          {tasks.map((task, index) => (
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
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
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
