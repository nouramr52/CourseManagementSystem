import api from "./axios.js";

// Attach the JWT token from localStorage to every request
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// POST /api/courses — instructor creates a course
export const createCourse = (data) =>
    api.post("/courses", data, { headers: authHeader() });

// GET /api/courses/mine — instructor gets their own courses
export const getMyCourses = () =>
    api.get("/courses/mine", { headers: authHeader() });

// GET /api/courses — all courses (catalog), token optional
export const getAllCourses = () => {
    const token = localStorage.getItem("token")
    return token
        ? api.get("/courses", { headers: { Authorization: `Bearer ${token}` } })
        : api.get("/courses")
};

// GET /api/courses/:id — one course with full details
export const getCourseById = (id) =>
    api.get(`/courses/${id}`, { headers: authHeader() });

// PUT /api/courses/:id — instructor updates a course
export const updateCourse = (id, data) =>
    api.put(`/courses/${id}`, data, { headers: authHeader() });

// DELETE /api/courses/:id — instructor deletes a course
export const deleteCourse = (id) =>
    api.delete(`/courses/${id}`, { headers: authHeader() });
