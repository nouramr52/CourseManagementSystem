import api from "./axios.js";

// Attach the JWT token from localStorage to every request
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// POST /api/enrollments/:courseId
// Student enrolls in a course
export const enrollInCourse = (courseId) =>
    api.post(`/enrollments/${courseId}`, {}, { headers: authHeader() });

// PATCH /api/enrollments/:courseId/drop
// Student drops a course
export const dropCourse = (courseId) =>
    api.patch(`/enrollments/${courseId}/drop`, {}, { headers: authHeader() });

// GET /api/enrollments/my
// Student gets all their enrolled courses
export const getMyEnrollments = () =>
    api.get("/enrollments/my", { headers: authHeader() });

// GET /api/enrollments/course/:courseId
// Instructor gets all students in one of their courses
export const getCourseStudents = (courseId) =>
    api.get(`/enrollments/course/${courseId}`, { headers: authHeader() });
