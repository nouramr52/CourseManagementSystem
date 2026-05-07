import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
    createCourseHandler,
    getMyCoursesHandler,
    getAllCoursesHandler,
    deleteCourseHandler,
} from "../controllers/courseController.js";

const router = express.Router();

// Create a course — INSTRUCTOR only
router.post("/", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), createCourseHandler);

// Get instructor's own courses
router.get("/mine", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), getMyCoursesHandler);

// Get all courses — any authenticated user
router.get("/", authMiddleware, getAllCoursesHandler);

// Delete a course — INSTRUCTOR only
router.delete("/:id", authMiddleware, roleMiddleware(["INSTRUCTOR", "ADMIN"]), deleteCourseHandler);

export default router;
