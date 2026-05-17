/**
 * courseService.js — Course business logic
 *
 * Uses:
 *  - Repository Pattern — data access delegated to courseRepos
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 *  - Shared helpers (timesOverlap) — DRY, no duplicated time logic
 */

import {
    createCourse,
    getAllCourses,
    getCourseById,
    getCoursesByInstructor,
    getSchedulesByInstructor,
    updateCourse,
    deleteCourse,
} from "../repositories/courseRepos.js";

import { timesOverlap } from "../utils/helpers.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";

// ─── CREATE ────────────────────────────────────────────────────────────────

export const addCourse = async ({ title, description, capacity, instructorId, schedules, dept, icon }) => {
    // Schedule conflict check — only run if slots were provided
    if (schedules && schedules.length > 0) {
        const existing = await getSchedulesByInstructor(instructorId);

        for (const newSlot of schedules) {
            if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) continue;

            for (const existingSlot of existing) {
                if (existingSlot.day !== newSlot.day) continue;

                if (timesOverlap(newSlot.startTime, newSlot.endTime,
                                 existingSlot.startTime, existingSlot.endTime)) {
                    throw new Error(
                        `Schedule conflict: ${newSlot.day} ${newSlot.startTime}–${newSlot.endTime} ` +
                        `overlaps with "${existingSlot.course.title}" ` +
                        `(${existingSlot.startTime}–${existingSlot.endTime})`
                    );
                }
            }
        }
    }

    const course = await createCourse({ title, description, capacity, instructorId, schedules, dept, icon });

    // Observer: notify listeners a course was created
    appEvents.emit(EVENTS.COURSE_CREATED, { instructorId, courseTitle: course.title });

    return course;
};

// ─── READ ──────────────────────────────────────────────────────────────────

export const fetchAllCourses = () => getAllCourses();

export const fetchCourseById = async (id) => {
    const course = await getCourseById(id);
    if (!course) throw new Error("Course not found");
    return course;
};

export const fetchMyCourses = (instructorId) => getCoursesByInstructor(instructorId);

// ─── UPDATE ────────────────────────────────────────────────────────────────

export const editCourse = async (courseId, requesterId, requesterRole, data) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    const { title, description, capacity } = data;
    return updateCourse(courseId, { title, description, capacity });
};

// ─── DELETE ────────────────────────────────────────────────────────────────

export const removeCourse = async (courseId, requesterId, requesterRole) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    await deleteCourse(courseId);

    // Observer: notify listeners a course was deleted
    appEvents.emit(EVENTS.COURSE_DELETED, { instructorId: requesterId, courseId });
};
