import React from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
  onAddTask: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ onAddTask }) => {
  const handleClick = () => {
    onAddTask();
  }

  return (
    <div id="sidebar">
      <div id="sidebar-title">Task Manager</div>
      <button className='add-button' onClick={handleClick}>Add Task</button>
    </div>
  );
}

export default Sidebar;
