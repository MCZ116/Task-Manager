import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Task from "../models/Task";
import "../styles/TaskTable.css";
import { StrictModeDroppable } from "./StrictModeDroppable";
import TaskItem from "./TaskItem";

interface Column {
  tasks: Task[];
  columnName: string;
  droppableId: string;
  onEdit: (taskId: number) => void;
}

const Column: React.FC<Column> = ({
  tasks,
  columnName,
  droppableId,
  onEdit,
}) => {
  return (
    <StrictModeDroppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="table-column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h5>{columnName}</h5>
          <hr />
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

export default Column;
