import axiosInstance from "../utility/axiosInstance";

export const fetchUsers = async () => {
  try {
    const request = await axiosInstance.get<User[]>("/api/users");
    return request.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
