import React from "react";
import "../styles/Button.css";
import DotsMenuIcon from "../assets/three-dots.svg";

const DotsMenuButton: React.FC = () => {
  return <img src={DotsMenuIcon} alt="menu icon" className="dots-item-menu" />;
};

export default DotsMenuButton;
