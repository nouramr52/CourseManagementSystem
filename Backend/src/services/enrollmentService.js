/**
 * enrollmentService.js — Enrollment business logic
 *
 * Uses:
 *  - Repository Pattern — data access delegated to enrollmentRepo / courseRepos
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 *  - Shared helpers (timesOverlap) — same conflict logic used for instructors
 */

import {
    createEnrollment,
    findEnrollment,
    getEnrollmentsByStudent,
    getEnrollmentsByCourse,
    countEnrollments,
    updateEnrollmentStatus,
    getActiveSchedulesByStudent,
} from "../repositories/enrollmentRepo.js";

import { getCourseById } from "../repositories/courseRepos.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";
import { timesOverlap } from "../utils/helpers.js";

// ─── ENROLL ────────────────────────────────────────────────────────────────

export const enrollStudent = async (studentId, courseId) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    // ── Already enrolled check ─────────────────────────────────────────────
    const existing = await findEnrollment(studentId, courseId);
    if (existing) {
        if (existing.status === "ACTIVE") throw new Error("Already enrolled in this course");
        // Re-activating a dropped enrollment — still run conflict check below
    }

    // ── Capacity check ─────────────────────────────────────────────────────
    const currentCount = await countEnrollments(courseId);
    if (currentCount >= course.capacity) throw new Error("Course is full");

    // ── Schedule conflict check ────────────────────────────────────────────
    // Only check if the new course actually has schedule slots
    if (course.schedules?.length > 0) {
        const existingSchedules = await getActiveSchedulesByStudent(studentId);

        for (const newSlot of course.schedules) {
            if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) continue;

            for (const existingSlot of existingSchedules) {
                if (existingSlot.day !== newSlot.day) continue;

                if (timesOverlap(
                    newSlot.startTime, newSlot.endTime,
                    existingSlot.startTime, existingSlot.endTime
                )) {
                    throw new Error(
                        `Schedule conflict: "${course.title}" on ${newSlot.day} ` +
                        `${newSlot.startTime}–${newSlot.endTime} overlaps with ` +
                        `"${existingSlot.course.title}" ` +
                        `(${existingSlot.startTime}–${existingSlot.endTime})`
                    );
                }
            }
        }
    }

    // ── All checks passed — create or re-activate enrollment ───────────────
    let enrollment;
    if (existing) {
        enrollment = await updateEnrollmentStatus(studentId, courseId, "ACTIVE");
    } else {
        enrollment = await createEnrollment(studentId, courseId);
    }

    appEvents.emit(EVENTS.ENROLLMENT_CREATED, { studentId, courseId, courseTitle: course.title });

    return enrollment;
};

// ─── DROP ──────────────────────────────────────────────────────────────────

export const dropCourse = async (studentId, courseId) => {
    const existing = await findEnrollment(studentId, courseId);
    if (!existing)                     throw new Error("You are not enrolled in this course");
    if (existing.status === "DROPPED") throw new Error("You have already dropped this course");

    const enrollment = await updateEnrollmentStatus(studentId, courseId, "DROPPED");

    const course = await getCourseById(courseId);
    appEvents.emit(EVENTS.ENROLLMENT_DROPPED, {
        studentId,
        courseId,
        courseTitle: course?.title ?? "Unknown",
    });

    return enrollment;
};

// ─── READ ──────────────────────────────────────────────────────────────────

export const getMyEnrollments = (studentId) => getEnrollmentsByStudent(studentId);

export const getStudentsInCourse = async (courseId, requesterId, requesterRole) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    return getEnrollmentsByCourse(courseId);
};
