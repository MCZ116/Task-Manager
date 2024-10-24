import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utility/axiosInstance";
import Avatar from "./Avatar";
import DropDownItem from "./DropdownItem";
import { useNavigate } from "react-router-dom";
import { getUserByToken } from "../services/userService";
import { getAvatarById, getImageAsBlob } from "../services/imageService";

const ProfileMenu: React.FC = () => {
  const [, setFile] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  const fetchUserAvatar = async () => {
    try {
      const userId = await getUserByToken();
      const response = await getAvatarById(userId.id);
      const avatarUrl = response.avatarUrl;

      if (avatarUrl) {
        const blobUrl = await getImageAsBlob(avatarUrl);

        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }

        console.log(blobUrl);
        setAvatarUrl(blobUrl);
      }
      console.log(response.avatarUrl);
    } catch (error) {
      console.error("Failed to fetch user avatar:", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);

      try {
        const response = await axiosInstance.post(
          "/user/upload/avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setFile(response.data.fileUrl);
        fetchUserAvatar();
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" id="dropdown-basic" className="p-0">
          <Avatar
            url={avatarUrl}
            setUrl={setAvatarUrl}
            size="w-25 rounded-circle"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <DropDownItem
            itemText={"Upload New Avatar"}
            onChange={handleUpload}
            id="file-upload"
            type="file"
          />
          <DropDownItem
            itemText={"Logout"}
            onClick={handleLogout}
            id="button"
            type="button"
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;
