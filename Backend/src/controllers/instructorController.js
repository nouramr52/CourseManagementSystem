import {
    fetchInstructorStats,
    fetchInstructorSchedule,
    fetchInstructorStudents,
    fetchInstructorNotifications,
} from "../services/instructorService.js";

// GET /api/instructor/stats
export const getInstructorStatsHandler = async (req, res) => {
    try {
        const stats = await fetchInstructorStats(req.user.id);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/instructor/schedule
export const getInstructorScheduleHandler = async (req, res) => {
    try {
        const schedule = await fetchInstructorSchedule(req.user.id);
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/instructor/students
export const getInstructorStudentsHandler = async (req, res) => {
    try {
        const students = await fetchInstructorStudents(req.user.id);
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/instructor/notifications
export const getInstructorNotificationsHandler = async (req, res) => {
    try {
        const notifications = await fetchInstructorNotifications(req.user.id);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
