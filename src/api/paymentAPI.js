import axiosInstance from "./axiosInstance";

export const createOrder = (courseId) =>
  axiosInstance.post(`/payments/create-order/${courseId}`);

export const verifyPayment = (data) =>
  axiosInstance.post("/payments/verify", data);