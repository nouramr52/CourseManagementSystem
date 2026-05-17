/**
 * enrollmentService.js — Enrollment business logic
 *
 * Uses:
 *  - Repository Pattern — data access delegated to enrollmentRepo / courseRepos
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 */

import {
    createEnrollment,
    findEnrollment,
    getEnrollmentsByStudent,
    getEnrollmentsByCourse,
    countEnrollments,
    updateEnrollmentStatus,
} from "../repositories/enrollmentRepo.js";

import { getCourseById } from "../repositories/courseRepos.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";

// ─── ENROLL ────────────────────────────────────────────────────────────────

export const enrollStudent = async (studentId, courseId) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    const existing = await findEnrollment(studentId, courseId);
    if (existing) {
        if (existing.status === "ACTIVE") throw new Error("Already enrolled in this course");
        // Re-activate a previously dropped enrollment
        const enrollment = await updateEnrollmentStatus(studentId, courseId, "ACTIVE");
        appEvents.emit(EVENTS.ENROLLMENT_CREATED, { studentId, courseId, courseTitle: course.title });
        return enrollment;
    }

    const currentCount = await countEnrollments(courseId);
    if (currentCount >= course.capacity) throw new Error("Course is full");

    const enrollment = await createEnrollment(studentId, courseId);

    // Observer: notify listeners an enrollment was created
    appEvents.emit(EVENTS.ENROLLMENT_CREATED, { studentId, courseId, courseTitle: course.title });

    return enrollment;
};

// ─── DROP ──────────────────────────────────────────────────────────────────

export const dropCourse = async (studentId, courseId) => {
    const existing = await findEnrollment(studentId, courseId);
    if (!existing)                        throw new Error("You are not enrolled in this course");
    if (existing.status === "DROPPED")    throw new Error("You have already dropped this course");

    const enrollment = await updateEnrollmentStatus(studentId, courseId, "DROPPED");

    // Observer: notify listeners an enrollment was dropped
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
