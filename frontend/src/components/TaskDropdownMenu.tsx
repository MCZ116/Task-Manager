import React, { forwardRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DeleteButton from "./DeleteButton";
import DotsMenuButton from "./DotsMenu";
import "../styles/Button.css";

interface CustomToggleProps {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CustomToggle = forwardRef<HTMLAnchorElement, CustomToggleProps>(
  ({ onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <DotsMenuButton />
    </a>
  )
);

interface CustomMenuProps {
  children: React.ReactNode;
  style: React.CSSProperties;
  className: string;
  "aria-labelledby": string;
}

const CustomMenu = forwardRef<HTMLDivElement, CustomMenuProps>(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">{React.Children.toArray(children)}</ul>
      </div>
    );
  }
);

interface CustomDropdown {
  onDelete: () => void;
}

const CustomDropdown: React.FC<CustomDropdown> = ({ onDelete }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />

      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item eventKey="1">
          <DeleteButton onDeleteTask={onDelete} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
