import axiosInstance from "../utility/axiosInstance";

interface AvatarResponse {
  avatarUrl: string | null;
}

export const getAvatarById = async (userId: number) => {
  const response = await axiosInstance.get<AvatarResponse>(
    "/user/avatar/" + userId
  );
  return response.data;
};

export const getImageAsBlob = async (url: string) => {
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
