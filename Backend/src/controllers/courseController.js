/**
 * courseController.js — HTTP layer for courses
 *
 * Uses DTOs for input validation and helpers for error mapping.
 * Controllers stay thin — no business logic here.
 */

import {
    addCourse,
    fetchAllCourses,
    fetchCourseById,
    fetchMyCourses,
    editCourse,
    removeCourse,
} from "../services/courseService.js";

import { validateCreateCourse } from "../dto/createCourse.js";
import { errorStatus } from "../utils/helpers.js";

// ─── POST /api/courses ─────────────────────────────────────────────────────
export const createCourseHandler = async (req, res) => {
    try {
        const validated = validateCreateCourse(req.body);   // DTO validation

        const course = await addCourse({
            ...validated,
            instructorId: req.user.id,
        });

        res.status(201).json(course);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

// ─── GET /api/courses ──────────────────────────────────────────────────────
export const getAllCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchAllCourses();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── GET /api/courses/:id ──────────────────────────────────────────────────
export const getCourseByIdHandler = async (req, res) => {
    try {
        const course = await fetchCourseById(Number(req.params.id));
        res.status(200).json(course);
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};

// ─── GET /api/courses/mine ─────────────────────────────────────────────────
export const getMyCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchMyCourses(req.user.id);
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── PUT /api/courses/:id ──────────────────────────────────────────────────
export const updateCourseHandler = async (req, res) => {
    try {
        const course = await editCourse(
            Number(req.params.id),
            req.user.id,
            req.user.role,
            req.body
        );
        res.status(200).json(course);
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};

// ─── DELETE /api/courses/:id ───────────────────────────────────────────────
export const deleteCourseHandler = async (req, res) => {
    try {
        await removeCourse(
            Number(req.params.id),
            req.user.id,
            req.user.role
        );
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(errorStatus(err.message)).json({ message: err.message });
    }
};
