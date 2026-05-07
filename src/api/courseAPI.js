import axiosInstance from "./axiosInstance";

export const getAllCourses = (page = 0, size = 10) =>
  axiosInstance.get(`/courses?page=${page}&size=${size}`);

export const getCourseById = (id) =>
  axiosInstance.get(`/courses/${id}`);

export const createCourse = (data) =>
  axiosInstance.post("/courses", data);

export const publishCourse = (id) =>
  axiosInstance.put(`/courses/${id}/publish`);

export const enrollCourse = (id) =>
  axiosInstance.post(`/courses/${id}/enroll`);