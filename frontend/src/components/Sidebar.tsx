import React from "react";
import "../styles/Sidebar.css";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div id="sidebar">
      <div id="sidebar-title">Task Manager</div>
      <hr />
    </div>
  );
};

export default Sidebar;
