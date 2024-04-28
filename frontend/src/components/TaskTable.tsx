import React from "react";
import Task from "../models/Task";
import "../styles/TaskTable.css";
import Column from "./Column";

interface TaskTableProps {
  blocked: Task[];
  progress: Task[];
  testing: Task[];
  done: Task[];
  onEdit: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  blocked,
  progress,
  testing,
  done,
  onEdit,
}) => {
  return (
    <div className="task-table-container">
      <Column
        tasks={blocked}
        columnName="Blocked"
        droppableId="blocked"
        onEdit={onEdit}
      />
      <Column
        tasks={progress}
        columnName="In Progress"
        droppableId="inProgress"
        onEdit={onEdit}
      />
      <Column
        tasks={testing}
        columnName="Testing"
        droppableId="testing"
        onEdit={onEdit}
      />
      <Column
        tasks={done}
        columnName="Done"
        droppableId="done"
        onEdit={onEdit}
      />
    </div>
  );
};

export default TaskTable;
