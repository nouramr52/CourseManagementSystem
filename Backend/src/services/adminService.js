/**
 * adminService.js — Admin business logic
 *
 * Uses:
 *  - Repository Pattern — all data access delegated to adminRepo
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 */

import {
    getAllUsers,
    getUserById,
    setUserRole,
    updateUser,
    deleteUser,
    createUser,
    getAllCoursesAdmin,
    adminUpdateCourse,
    adminDeleteCourse,
    getPlatformStats,
    getTopCourses,
    getRecentUsers,
    getRecentCourses,
    getMonthlyEnrollments,
} from "../repositories/adminRepo.js";

import appEvents, { EVENTS } from "../utils/eventEmitter.js";

// ─── USERS ─────────────────────────────────────────────────────────────────

export const fetchAllUsers = () => getAllUsers();

export const fetchUserById = async (id) => {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");
    return user;
};

export const changeUserRole = async (id, role) => {
    const allowed = ["STUDENT", "INSTRUCTOR", "ADMIN"];
    const normalized = role?.toUpperCase();
    if (!allowed.includes(normalized)) {
        throw new Error(`Invalid role. Must be one of: ${allowed.join(", ")}`);
    }

    const user = await getUserById(id);
    if (!user) throw new Error("User not found");

    return setUserRole(id, normalized);
};

export const editUser = async (id, data) => {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");

    const { name, email } = data;
    const updateData = {};
    if (name  && name.trim())  updateData.name  = name.trim();
    if (email && email.trim()) updateData.email = email.trim();

    if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
    }

    return updateUser(id, updateData);
};

export const removeUser = async (id) => {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");

    await deleteUser(id);

    appEvents.emit(EVENTS.USER_REGISTERED, { userId: id, action: "deleted" });
};

export const addUser = async (data) => {
    const { name, email, password, role } = data;
    if (!name || !email || !password || !role) throw new Error("name, email, password and role are required");

    const allowed = ["STUDENT", "INSTRUCTOR", "ADMIN"];
    const normalized = role.toUpperCase();
    if (!allowed.includes(normalized)) throw new Error(`Invalid role. Must be one of: ${allowed.join(", ")}`);

    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.default.hash(password, 10);

    return createUser({ name, email, password: hashed, role: normalized, isEmailVerified: true });
};

// ─── COURSES ───────────────────────────────────────────────────────────────

export const fetchAllCoursesAdmin = () => getAllCoursesAdmin();

export const editCourseAdmin = async (id, data) => {
    const { title, description, capacity, dept, icon } = data;
    const updateData = {};
    if (title)       updateData.title       = title.trim();
    if (description) updateData.description = description.trim();
    if (capacity)    updateData.capacity    = Number(capacity);
    if (dept)        updateData.dept        = dept.trim();
    if (icon)        updateData.icon        = icon.trim();

    if (Object.keys(updateData).length === 0) throw new Error("No valid fields to update");
    return adminUpdateCourse(id, updateData);
};

export const removeCourseAdmin = async (id) => {
    return adminDeleteCourse(id);
};

// ─── STATS / ANALYTICS ─────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
    const [stats, topCourses, recentUsers, recentCourses, monthlyEnrollments] =
        await Promise.all([
            getPlatformStats(),
            getTopCourses(),
            getRecentUsers(),
            getRecentCourses(),
            getMonthlyEnrollments(),
        ]);

    return {
        stats,
        topCourses,
        recentUsers,
        recentCourses,
        monthlyEnrollments,
    };
};

export const fetchAnalytics = async () => {
    const [stats, topCourses, monthlyEnrollments] = await Promise.all([
        getPlatformStats(),
        getTopCourses(),
        getMonthlyEnrollments(),
    ]);

    return { stats, topCourses, monthlyEnrollments };
};
