import React from "react";
import Task from "../models/Task";
import "../styles/TaskTable.css";
import Column from "./Column";

interface TaskTableProps {
  blocked: Task[];
  progress: Task[];
  testing: Task[];
  done: Task[];
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  blocked,
  progress,
  testing,
  done,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="task-table-container">
      <Column
        tasks={blocked}
        columnName="Blocked"
        droppableId="blocked"
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Column
        tasks={progress}
        columnName="In Progress"
        droppableId="in-progress"
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Column
        tasks={testing}
        columnName="Testing"
        droppableId="testing"
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Column
        tasks={done}
        columnName="Done"
        droppableId="done"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default TaskTable;
