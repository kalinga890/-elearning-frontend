import axiosInstance from "./axiosInstance";

export const getCourseReviews = (courseId) =>
  axiosInstance.get(`/reviews/${courseId}`);

export const addReview = (courseId, data) =>
  axiosInstance.post(`/reviews/${courseId}`, data);

export const getAverageRating = (courseId) =>
  axiosInstance.get(`/reviews/${courseId}/rating`);