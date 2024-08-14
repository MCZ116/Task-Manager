import "bootstrap/dist/css/bootstrap.min.css";
import avatarDefault from "../assets/profile-default.svg";

interface AvatarProps {
  url: string | null;
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const Avatar: React.FC<AvatarProps> = ({ url, setUrl }) => {
  return (
    <div>
      {url ? (
        <img
          src={url}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
          onError={() => setUrl}
        />
      ) : (
        <img
          src={avatarDefault}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      )}
    </div>
  );
};

export default Avatar;
