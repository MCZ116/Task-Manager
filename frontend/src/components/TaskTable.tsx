import React from "react";
import Task from "../interfaces/Task";
import "../styles/TaskTable.css";
import Column from "./Column";

interface TaskTableProps {
  blocked: Task[];
  progress: Task[];
  testing: Task[];
  done: Task[];
  onEdit: (task: Task) => void;
  user: User[];
}

const TaskTable: React.FC<TaskTableProps> = ({
  blocked,
  progress,
  testing,
  done,
  onEdit,
  user,
}) => {
  return (
    <div className="task-table-container">
      <Column
        tasks={blocked}
        columnName="Blocked"
        droppableId="blocked"
        onEdit={onEdit}
        user={user}
      />
      <Column
        tasks={progress}
        columnName="In Progress"
        droppableId="inProgress"
        onEdit={onEdit}
        user={user}
      />
      <Column
        tasks={testing}
        columnName="Testing"
        droppableId="testing"
        onEdit={onEdit}
        user={user}
      />
      <Column
        tasks={done}
        columnName="Done"
        droppableId="done"
        onEdit={onEdit}
        user={user}
      />
    </div>
  );
};

export default TaskTable;
