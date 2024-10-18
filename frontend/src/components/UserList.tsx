import { Form } from "react-bootstrap";

interface UserListProps {
  selectedUserId: number;
  onUserSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  user: User[];
}

const UserList: React.FC<UserListProps> = ({
  selectedUserId,
  onUserSelect,
  user,
}) => {
  return (
    <div className="outer">
      Assign user:
      <div>
        <Form.Select
          name="assignedUserId"
          value={selectedUserId}
          onChange={onUserSelect}
        >
          <option value="">No assigned user</option>
          {user.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
};
export default UserList;
