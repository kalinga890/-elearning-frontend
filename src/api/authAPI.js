import axiosInstance from "./axiosInstance";

export const syncUser = (userData) =>
  axiosInstance.post("/auth/sync", userData);

export const getMyProfile = () =>
  axiosInstance.get("/auth/me");