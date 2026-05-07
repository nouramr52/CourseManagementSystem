import api from "./axios.js";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createCourse = (data) =>
    api.post("/courses", data, { headers: authHeader() });

export const getMyCourses = () =>
    api.get("/courses/mine", { headers: authHeader() });

export const getAllCourses = () =>
    api.get("/courses", { headers: authHeader() });

export const deleteCourse = (id) =>
    api.delete(`/courses/${id}`, { headers: authHeader() });
