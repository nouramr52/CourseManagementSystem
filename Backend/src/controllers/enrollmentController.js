/**
 * enrollmentController.js — HTTP layer for enrollments
 *
 * Uses errorStatus helper to map domain errors to HTTP codes.
 * Controllers stay thin — no business logic here.
 */

import {
    enrollStudent,
    dropCourse,
    getMyEnrollments,
    getStudentsInCourse,
} from "../services/enrollmentService.js";

import { errorStatus } from "../utils/helpers.js";

// ─── POST /api/enrollments/:courseId ──────────────────────────────────────
export const enrollHandler = async (req, res) => {
    try {
        const enrollment = await enrollStudent(
            req.user.id,
            Number(req.params.courseId)
        );
        res.status(201).json(enrollment);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// ─── PATCH /api/enrollments/:courseId/drop ─────────────────────────────────
export const dropHandler = async (req, res) => {
    try {
        const enrollment = await dropCourse(
            req.user.id,
            Number(req.params.courseId)
        );
        res.status(200).json(enrollment);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// ─── GET /api/enrollments/my ───────────────────────────────────────────────
export const getMyEnrollmentsHandler = async (req, res) => {
    try {
        const enrollments = await getMyEnrollments(req.user.id);
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── GET /api/enrollments/course/:courseId ─────────────────────────────────
export const getCourseStudentsHandler = async (req, res) => {
    try {
        const students = await getStudentsInCourse(
            Number(req.params.courseId),
            req.user.id,
            req.user.role
        );
        res.status(200).json(students);
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};
