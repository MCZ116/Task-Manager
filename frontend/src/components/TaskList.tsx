import React from 'react';
import TaskItem from './TaskItem';
import Task from '../utility/Task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (taskId: number) => void; 
  onDelete: (taskId: number) => void; 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className='task-list'>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
