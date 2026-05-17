/**
 * adminRoutes.js — All /api/admin/* endpoints
 *
 * Every route here requires:
 *  1. authMiddleware  — valid JWT
 *  2. roleMiddleware  — ADMIN role only
 */

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
    getDashboardHandler,
    getAnalyticsHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    changeRoleHandler,
    deleteUserHandler,
    createUserHandler,
    getAllCoursesHandler,
    updateCourseHandler,
    deleteCourseHandler,
} from "../controllers/adminController.js";

const router = express.Router();

// Apply auth + admin role check to every route in this file
router.use(authMiddleware, roleMiddleware(["ADMIN"]));

// ─── DASHBOARD & ANALYTICS ─────────────────────────────────────────────────

// GET /api/admin/dashboard  — overview stats + recent activity
router.get("/dashboard", getDashboardHandler);

// GET /api/admin/analytics  — detailed analytics data
router.get("/analytics", getAnalyticsHandler);

// ─── USER MANAGEMENT ───────────────────────────────────────────────────────

// GET    /api/admin/users          — list all users
router.get("/users", getAllUsersHandler);

// GET    /api/admin/users/:id      — get one user
router.get("/users/:id", getUserByIdHandler);

// POST   /api/admin/users          — create a user
router.post("/users", createUserHandler);

// PATCH  /api/admin/users/:id      — update name / email
router.patch("/users/:id", updateUserHandler);

// PATCH  /api/admin/users/:id/role — change role
router.patch("/users/:id/role", changeRoleHandler);

// DELETE /api/admin/users/:id      — delete user
router.delete("/users/:id", deleteUserHandler);

// ─── COURSE MANAGEMENT ─────────────────────────────────────────────────────

// GET    /api/admin/courses         — list all courses
router.get("/courses", getAllCoursesHandler);

// PUT    /api/admin/courses/:id     — update a course
router.put("/courses/:id", updateCourseHandler);

// DELETE /api/admin/courses/:id     — delete a course
router.delete("/courses/:id", deleteCourseHandler);

export default router;
