import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
    createCourseHandler,
    getAllCoursesHandler,
    getCourseByIdHandler,
    getMyCoursesHandler,
    updateCourseHandler,
    deleteCourseHandler,
} from "../controllers/courseController.js";

const router = express.Router();

// ── Public (any logged-in user) ────────────────────────────────────────────

// GET /api/courses
// Returns all courses — public, no auth required for browsing
router.get("/", getAllCoursesHandler);

// GET /api/courses/mine
// Returns only the courses owned by the logged-in instructor
// NOTE: /mine must be defined BEFORE /:id so Express doesn't treat "mine" as an id
router.get("/mine", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), getMyCoursesHandler);

// GET /api/courses/:id
// Returns one course with full details
router.get("/:id", authMiddleware, getCourseByIdHandler);

// ── Instructor / Admin only ────────────────────────────────────────────────

// POST /api/courses
// Creates a new course — only instructors and admins
router.post("/", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), createCourseHandler);

// PUT /api/courses/:id
// Updates a course — only the owning instructor or an admin
router.put("/:id", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), updateCourseHandler);

// DELETE /api/courses/:id
// Deletes a course — only the owning instructor or an admin
router.delete("/:id", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), deleteCourseHandler);

export default router;
