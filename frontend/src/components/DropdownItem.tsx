import React, { ChangeEvent, MouseEvent } from "react";
import { Dropdown } from "react-bootstrap";

interface DropDownItemProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  itemText: string;
  id: string;
  type: "file" | "button";
}

const DropDownItem: React.FC<DropDownItemProps> = ({
  onChange,
  onClick,
  itemText,
  id,
  type,
}) => {
  return (
    <div>
      {type === "file" ? (
        <Dropdown.Item as="label" style={{ cursor: "pointer" }}>
          {itemText}
          <input
            id={id}
            type="file"
            onChange={onChange}
            style={{ display: "none" }}
          />
        </Dropdown.Item>
      ) : (
        <Dropdown.Item
          as="button"
          style={{ cursor: "pointer", border: "none", background: "none" }}
          onClick={onClick}
        >
          {itemText}
        </Dropdown.Item>
      )}
    </div>
  );
};

export default DropDownItem;
