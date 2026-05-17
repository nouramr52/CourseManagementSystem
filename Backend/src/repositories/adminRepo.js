/**
 * adminRepo.js — Data access layer for admin operations
 *
 * All raw Prisma queries for admin-only features live here.
 * Services call these functions — never Prisma directly.
 */

import prisma from "../config/db.js";

// ─── USERS ─────────────────────────────────────────────────────────────────

// Return all users with safe fields only (no passwords)
export const getAllUsers = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            _count: {
                select: {
                    enrollments: true,
                    coursesCreated: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

// Return one user by id (no password)
export const getUserById = (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            _count: {
                select: {
                    enrollments: true,
                    coursesCreated: true,
                },
            },
        },
    });
};

// Update a user's role
export const setUserRole = (id, role) => {
    return prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
    });
};

// Update a user's name or email
export const updateUser = (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
};

// Hard-delete a user by id
export const deleteUser = (id) => {
    return prisma.user.delete({ where: { id } });
};

// Create a new user (admin-initiated)
export const createUser = (data) => {
    return prisma.user.create({
        data,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
};

// ─── COURSES (admin) ───────────────────────────────────────────────────────

export const getAllCoursesAdmin = () => {
    return prisma.course.findMany({
        include: {
            instructor: { select: { id: true, name: true } },
            schedules: true,
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const adminUpdateCourse = (id, data) => {
    return prisma.course.update({
        where: { id },
        data,
        include: {
            instructor: { select: { id: true, name: true } },
            _count: { select: { enrollments: true } },
        },
    });
};

export const adminDeleteCourse = (id) => {
    return prisma.course.delete({ where: { id } });
};

// ─── STATS ─────────────────────────────────────────────────────────────────

// Aggregate counts for the admin overview dashboard
export const getPlatformStats = async () => {
    const [
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalEnrollments,
        activeEnrollments,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "INSTRUCTOR" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.enrollment.count({ where: { status: "ACTIVE" } }),
    ]);

    return {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalEnrollments,
        activeEnrollments,
    };
};

// Return the 5 most-enrolled courses
export const getTopCourses = () => {
    return prisma.course.findMany({
        take: 5,
        include: {
            instructor: { select: { id: true, name: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: {
            enrollments: { _count: "desc" },
        },
    });
};

// Return the 5 most recently registered users
export const getRecentUsers = () => {
    return prisma.user.findMany({
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

// Return the 5 most recently created courses
export const getRecentCourses = () => {
    return prisma.course.findMany({
        take: 5,
        include: {
            instructor: { select: { id: true, name: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

// Monthly enrollment counts for the last 12 months
export const getMonthlyEnrollments = async () => {
    const rows = await prisma.$queryRaw`
        SELECT
            TO_CHAR(DATE_TRUNC('month', "enrollmentDate"), 'Mon') AS month,
            DATE_TRUNC('month', "enrollmentDate")                 AS month_date,
            COUNT(*)::int                                         AS count
        FROM "Enrollment"
        WHERE "enrollmentDate" >= NOW() - INTERVAL '12 months'
        GROUP BY month_date, month
        ORDER BY month_date ASC
    `;
    return rows;
};
