import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Task from "../utility/Task";
import "../styles/TaskTable.css";
import { StrictModeDroppable } from "./StrictModeDroppable";
import TaskItem from "./TaskItem";

interface Column {
  tasks: Task[];
  columnName: string;
  droppableId: string;
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const Column: React.FC<Column> = ({
  tasks,
  columnName,
  droppableId,
  onEdit,
  onDelete,
}) => {
  return (
    <StrictModeDroppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="table-column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h3>{columnName}</h3>
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

export default Column;
