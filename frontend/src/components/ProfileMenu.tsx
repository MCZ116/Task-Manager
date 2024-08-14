import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utility/axiosInstance";
import Avatar from "./Avatar";
import DropDownItem from "./DropdownItem";

interface AvatarResponse {
  avatarUrl: string | null;
}

const ProfileMenu: React.FC = () => {
  const [, setFile] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  const fetchUserAvatar = async () => {
    try {
      const response = await axiosInstance.get<AvatarResponse>("/user/avatar");
      const avatarUrl = response.data.avatarUrl;

      if (avatarUrl) {
        const blobUrl = await fetchImageAsBlob(avatarUrl);

        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }

        console.log(blobUrl);
        setAvatarUrl(blobUrl);
      }
      console.log(response.data.avatarUrl);
    } catch (error) {
      console.error("Failed to fetch user avatar:", error);
    }
  };

  const fetchImageAsBlob = async (url: string) => {
    try {
      // Fetch the image with authorization using axiosInstance
      const response = await axiosInstance.get(url, { responseType: "blob" });

      if (response.status !== 200) {
        console.error(`Failed to fetch image: ${response.statusText}`);
        return null;
      }

      // Create a Blob URL from the fetched Blob
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching the image as a blob:", error);
      return null;
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

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" id="dropdown-basic" className="p-0">
          <Avatar url={avatarUrl} setUrl={setAvatarUrl} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <DropDownItem
            itemText={"Upload New Avatar"}
            onAction={handleUpload}
            id="file-upload"
            type="file"
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;
