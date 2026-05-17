import express from "express";
import {
    getMyScheduleHandler,
    getAllSchedulesHandler,
    createScheduleHandler,
    updateScheduleHandler,
    deleteScheduleHandler,
    checkConflictsHandler
} from "../controllers/scheduleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ─── STUDENT / INSTRUCTOR / ADMIN ROUTES ───────────────────────────────────

// Get my schedule (based on enrolled courses for students, taught courses for instructors)
router.get("/my", authMiddleware, getMyScheduleHandler);

// Check for schedule conflicts before enrolling
router.post("/check-conflicts", authMiddleware, roleMiddleware(["STUDENT"]), checkConflictsHandler);

// ─── ADMIN ONLY ROUTES ─────────────────────────────────────────────────────

// Get all schedules in the system
router.get("/all", authMiddleware, roleMiddleware(["ADMIN"]), getAllSchedulesHandler);

// ─── INSTRUCTOR / ADMIN ROUTES ─────────────────────────────────────────────

// Create a new schedule slot for a course
router.post("/course/:courseId", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), createScheduleHandler);

// Update a schedule slot
router.put("/:scheduleId", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), updateScheduleHandler);

// Delete a schedule slot
router.delete("/:scheduleId", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), deleteScheduleHandler);

export default router;
