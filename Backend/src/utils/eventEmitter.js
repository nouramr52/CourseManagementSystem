/**
 * eventEmitter.js — Observer Pattern implementation
 *
 * Decouples side effects from core business logic.
 * When an enrollment is created or dropped, the service emits an event.
 * Any number of listeners can react without the service knowing about them.
 *
 * This satisfies:
 *  - Open/Closed Principle: add new reactions (email, analytics, audit log)
 *    by registering a new listener — no changes to enrollmentService.js
 *  - Single Responsibility: the service only handles business logic;
 *    side effects live in their own listeners
 *  - Observer Pattern: subjects (services) emit events; observers (listeners)
 *    react independently
 */

import { EventEmitter } from "events";

// ── Singleton instance ─────────────────────────────────────────────────────
// One shared emitter for the whole application (Singleton Pattern).
const appEvents = new EventEmitter();

// ── Event name constants ───────────────────────────────────────────────────
// Using constants prevents typo bugs from silent failures.
export const EVENTS = {
    ENROLLMENT_CREATED: "enrollment:created",
    ENROLLMENT_DROPPED: "enrollment:dropped",
    COURSE_CREATED:     "course:created",
    COURSE_DELETED:     "course:deleted",
    USER_REGISTERED:    "user:registered",
};

// ── Default listeners (audit log to console) ──────────────────────────────
// In production these would write to a database audit table or send emails.

appEvents.on(EVENTS.ENROLLMENT_CREATED, ({ studentId, courseId, courseTitle }) => {
    console.log(`[EVENT] Student ${studentId} enrolled in "${courseTitle}" (course ${courseId})`);
});

appEvents.on(EVENTS.ENROLLMENT_DROPPED, ({ studentId, courseId, courseTitle }) => {
    console.log(`[EVENT] Student ${studentId} dropped "${courseTitle}" (course ${courseId})`);
});

appEvents.on(EVENTS.COURSE_CREATED, ({ instructorId, courseTitle }) => {
    console.log(`[EVENT] Instructor ${instructorId} created course "${courseTitle}"`);
});

appEvents.on(EVENTS.COURSE_DELETED, ({ instructorId, courseId }) => {
    console.log(`[EVENT] Instructor ${instructorId} deleted course ${courseId}`);
});

appEvents.on(EVENTS.USER_REGISTERED, ({ userId, email, role }) => {
    console.log(`[EVENT] New ${role} registered: ${email} (id=${userId})`);
});

export default appEvents;
