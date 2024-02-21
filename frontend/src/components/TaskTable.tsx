import React from 'react';
import { Droppable, Draggable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import Task from '../utility/Task';
import '../styles/TaskTable.css';

interface TaskTableProps {
  tasks: Task[];
  onMoveTask: (sourceIndex: number, destinationIndex: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onMoveTask }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    onMoveTask(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="task-table-container">
        <Droppable droppableId="task-table" direction="horizontal" type="TASK">
          {(provided) => (
            <div
              className="task-table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="table-column">
                <h3>To Do</h3>
                <ul>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id.toString()}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                </ul>
              </div>
              <div className="table-column">
                <h3>In Progress</h3>
              </div>
              <div className="table-column">
                <h3>Testing</h3>
              </div>
              <div className="table-column">
                <h3>Done</h3>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TaskTable;
