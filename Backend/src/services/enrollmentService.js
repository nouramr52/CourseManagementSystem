import {
    createEnrollment,
    findEnrollment,
    getEnrollmentsByStudent,
    getEnrollmentsByCourse,
    countEnrollments,
    updateEnrollmentStatus,
} from "../repositories/enrollmentRepo.js";

import { getCourseById } from "../repositories/courseRepos.js";

// ─── ENROLL ────────────────────────────────────────────────────────────────

// Called when a student clicks "Enroll" on a course.
// Runs three checks before creating the enrollment:
//   1. The course must exist
//   2. The student must not already be enrolled
//   3. The course must not be full (enrolled count < capacity)
export const enrollStudent = async (studentId, courseId) => {
    // Check 1 — does the course exist?
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    // Check 2 — is the student already enrolled?
    const existing = await findEnrollment(studentId, courseId);
    if (existing) {
        if (existing.status === "ACTIVE") {
            throw new Error("Already enrolled in this course");
        }
        // If they previously dropped, re-activate instead of creating a duplicate
        return updateEnrollmentStatus(studentId, courseId, "ACTIVE");
    }

    // Check 3 — is the course full?
    const currentCount = await countEnrollments(courseId);
    if (currentCount >= course.capacity) {
        throw new Error("Course is full");
    }

    // All checks passed — create the enrollment
    return createEnrollment(studentId, courseId);
};

// ─── DROP ──────────────────────────────────────────────────────────────────

// Called when a student clicks "Drop Course".
// Sets the enrollment status to DROPPED instead of deleting the row,
// so we keep a history of who was enrolled.
export const dropCourse = async (studentId, courseId) => {
    const existing = await findEnrollment(studentId, courseId);

    if (!existing) {
        throw new Error("You are not enrolled in this course");
    }

    if (existing.status === "DROPPED") {
        throw new Error("You have already dropped this course");
    }

    return updateEnrollmentStatus(studentId, courseId, "DROPPED");
};

// ─── READ ──────────────────────────────────────────────────────────────────

// Return all courses a student is enrolled in.
// Used in the student dashboard "My Courses" page.
export const getMyEnrollments = (studentId) => {
    return getEnrollmentsByStudent(studentId);
};

// Return all students enrolled in a specific course.
// Used in the instructor dashboard "Students" tab.
// Checks that the requester is the course instructor or an admin.
export const getStudentsInCourse = async (courseId, requesterId, requesterRole) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    return getEnrollmentsByCourse(courseId);
};
