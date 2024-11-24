import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import Task from "../interfaces/Task";
import "../styles/TaskTable.css";
import { StrictModeDroppable } from "./StrictModeDroppable";
import TaskItem from "./TaskItem";

interface Column {
  tasks: Task[];
  columnName: string;
  droppableId: string;
  onEdit: (task: Task) => void;
  user: User[];
}

const Column: React.FC<Column> = ({
  tasks,
  columnName,
  droppableId,
  onEdit,
  user,
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
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    user={user}
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
