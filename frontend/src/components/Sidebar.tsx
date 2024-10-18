import React from "react";
import "../styles/Sidebar.css";
import ProfileMenu from "./ProfileMenu";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div id="sidebar">
      <div id="sidebar-title">Task Manager</div>
      <hr />
      <ProfileMenu />
    </div>
  );
};

export default Sidebar;
