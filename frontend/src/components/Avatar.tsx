import "bootstrap/dist/css/bootstrap.min.css";
import avatarDefault from "../assets/profile-default.svg";

interface AvatarProps {
  url: string | null;
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
  size: string;
}

const Avatar: React.FC<AvatarProps> = ({ url, setUrl, size }) => {
  return (
    <>
      {url ? (
        <img src={url} alt="Avatar" className={size} onError={() => setUrl} />
      ) : (
        <img src={avatarDefault} alt="Avatar" className={size} />
      )}
    </>
  );
};

export default Avatar;
