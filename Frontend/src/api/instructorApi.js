import api from "./axios.js";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET /api/instructor/stats
// Returns { totalCourses, totalStudents, totalMaterials, scheduleConflicts }
export const getInstructorStats = () =>
    api.get("/instructor/stats", { headers: authHeader() });

// GET /api/instructor/schedule
// Returns all schedule slots with conflict flags
export const getInstructorSchedule = () =>
    api.get("/instructor/schedule", { headers: authHeader() });

// GET /api/instructor/students
// Returns all students enrolled in any of the instructor's courses
export const getInstructorStudents = () =>
    api.get("/instructor/students", { headers: authHeader() });

// GET /api/instructor/notifications
// Returns recent enrollment activity as notifications
export const getInstructorNotifications = () =>
    api.get("/instructor/notifications", { headers: authHeader() });
