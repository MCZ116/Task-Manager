import "../styles/TaskItem.css";
import Task from "../interfaces/Task";
import clockIcon from "../assets/clock.svg";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import { getAvatarById, getImageAsBlob } from "../services/imageService";
import { useAuth } from "../contexts/AuthProvider";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  user: User[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, user = [] }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const auth = useAuth();

  const handleEditClick = () => {
    onEdit(task);
  };

  useEffect(() => {
    fetchUserAvatar();
  }, [task.assignedUserId, auth?.avatarUrl]);

  const fetchUserAvatar = async () => {
    try {
      const response = await getAvatarById(task.assignedUserId);
      const avatarUrl = response.avatarUrl;

      if (avatarUrl) {
        const blobUrl = await getImageAsBlob(avatarUrl);

        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }

        setAvatarUrl(blobUrl);
      }
    } catch (error) {
      console.error("Failed to fetch user avatar:", error);
    }
  };

  return (
    <div className="task-item" onClick={handleEditClick}>
      <h6>{task.name}</h6>
      {user
        .filter((user: User) => user.id === task.assignedUserId)
        .map((user: User) => (
          <div key={user.id} style={{ height: "30px" }}>
            <Avatar
              url={avatarUrl}
              setUrl={setAvatarUrl}
              size="h-100 rounded-circle me-1"
            />
            {user.firstName || "N/A"} {user.lastName || "N/A"}
          </div>
        ))}
      {user.filter((user: User) => user.id === task.assignedUserId).length ===
        0 && <p>No assigned user</p>}
      <div className="d-flex align-items-center mt-1">
        <img src={clockIcon} alt="clock icon" className="img-fluid me-1" />
        <span>{task.dueDate.toString()}</span>
      </div>
    </div>
  );
};
export default TaskItem;
