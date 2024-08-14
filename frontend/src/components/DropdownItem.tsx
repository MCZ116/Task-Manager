import { Dropdown } from "react-bootstrap";

interface DropDownItemProps {
  onAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  itemText: string;
  id: string;
  type: string;
}

const DropDownItem: React.FC<DropDownItemProps> = ({
  onAction,
  itemText,
  id,
  type,
}) => {
  return (
    <div>
      <Dropdown.Item as="label" style={{ cursor: "pointer" }}>
        {itemText}
        <input
          id={id}
          type={type}
          onChange={onAction}
          style={{ display: "none" }}
        />
      </Dropdown.Item>
    </div>
  );
};

export default DropDownItem;
