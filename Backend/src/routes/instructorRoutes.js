import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
    getInstructorStatsHandler,
    getInstructorScheduleHandler,
    getInstructorStudentsHandler,
    getInstructorNotificationsHandler,
} from "../controllers/instructorController.js";

const router = express.Router();

// All instructor routes require authentication and INSTRUCTOR (or ADMIN) role
const guard = [authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"])];

// GET /api/instructor/stats
router.get("/stats", ...guard, getInstructorStatsHandler);

// GET /api/instructor/schedule
router.get("/schedule", ...guard, getInstructorScheduleHandler);

// GET /api/instructor/students
router.get("/students", ...guard, getInstructorStudentsHandler);

// GET /api/instructor/notifications
// Returns recent enrollments across the instructor's courses as notifications
router.get("/notifications", ...guard, getInstructorNotificationsHandler);

export default router;
