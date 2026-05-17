/**
 * adminController.js — HTTP layer for admin operations
 *
 * Controllers stay thin — no business logic here.
 * All logic lives in adminService.
 */

import {
    fetchAllUsers,
    fetchUserById,
    changeUserRole,
    editUser,
    removeUser,
    addUser,
    fetchAllCoursesAdmin,
    editCourseAdmin,
    removeCourseAdmin,
    fetchDashboardStats,
    fetchAnalytics,
} from "../services/adminService.js";

import { errorStatus } from "../utils/helpers.js";

// ─── DASHBOARD ─────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
export const getDashboardHandler = async (req, res) => {
    try {
        const data = await fetchDashboardStats();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── ANALYTICS ─────────────────────────────────────────────────────────────

// GET /api/admin/analytics
export const getAnalyticsHandler = async (req, res) => {
    try {
        const data = await fetchAnalytics();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── USERS ─────────────────────────────────────────────────────────────────

// GET /api/admin/users
export const getAllUsersHandler = async (req, res) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/users/:id
export const getUserByIdHandler = async (req, res) => {
    try {
        const user = await fetchUserById(Number(req.params.id));
        res.status(200).json(user);
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};

// PATCH /api/admin/users/:id
// Update name / email
export const updateUserHandler = async (req, res) => {
    try {
        const user = await editUser(Number(req.params.id), req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// PATCH /api/admin/users/:id/role
// Change a user's role
export const changeRoleHandler = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: "role is required" });

        const user = await changeUserRole(Number(req.params.id), role);
        res.status(200).json(user);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// DELETE /api/admin/users/:id
export const deleteUserHandler = async (req, res) => {
    try {
        await removeUser(Number(req.params.id));
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};

// POST /api/admin/users
export const createUserHandler = async (req, res) => {
    try {
        const user = await addUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// ─── COURSES ───────────────────────────────────────────────────────────────

// GET /api/admin/courses
export const getAllCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchAllCoursesAdmin();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/courses/:id
export const updateCourseHandler = async (req, res) => {
    try {
        const course = await editCourseAdmin(Number(req.params.id), req.body);
        res.status(200).json(course);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// DELETE /api/admin/courses/:id
export const deleteCourseHandler = async (req, res) => {
    try {
        await removeCourseAdmin(Number(req.params.id));
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};
