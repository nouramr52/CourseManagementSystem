import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
    enrollHandler,
    dropHandler,
    getMyEnrollmentsHandler,
    getCourseStudentsHandler,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// ── Student routes ─────────────────────────────────────────────────────────

// POST /api/enrollments/:courseId
// Student enrolls in a course
router.post("/:courseId", authMiddleware, roleMiddleware(["STUDENT"]), enrollHandler);

// PATCH /api/enrollments/:courseId/drop
// Student drops a course
router.patch("/:courseId/drop", authMiddleware, roleMiddleware(["STUDENT"]), dropHandler);

// GET /api/enrollments/my
// Student gets all their enrolled courses
// NOTE: /my must be before /:courseId so Express doesn't treat "my" as a courseId
router.get("/my", authMiddleware, roleMiddleware(["STUDENT"]), getMyEnrollmentsHandler);

// ── Instructor / Admin routes ──────────────────────────────────────────────

// GET /api/enrollments/course/:courseId
// Instructor gets all students enrolled in one of their courses
router.get("/course/:courseId", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), getCourseStudentsHandler);

export default router;
