/**
 * helpers.js — shared utility functions (Single Responsibility Principle)
 *
 * Extracted here so they can be reused across services without duplication
 * (Don't Repeat Yourself) and tested in isolation.
 */

// ─── Time utilities ────────────────────────────────────────────────────────

/**
 * Convert "HH:MM" string to total minutes since midnight.
 * Makes time-range comparison arithmetic simple and readable.
 * @param {string} timeStr  e.g. "10:30"
 * @returns {number}        e.g. 630
 */
export const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

/**
 * Returns true when two time ranges on the same day overlap.
 * Uses the standard interval-overlap formula:
 *   A starts before B ends  AND  A ends after B starts
 *
 * @param {string} startA  "HH:MM"
 * @param {string} endA    "HH:MM"
 * @param {string} startB  "HH:MM"
 * @param {string} endB    "HH:MM"
 * @returns {boolean}
 */
export const timesOverlap = (startA, endA, startB, endB) => {
    return toMinutes(startA) < toMinutes(endB) &&
           toMinutes(endA)   > toMinutes(startB);
};

// ─── HTTP response helpers ─────────────────────────────────────────────────

/**
 * Map a well-known domain error message to the correct HTTP status code.
 * Centralises the message→status mapping so controllers stay thin.
 *
 * @param {string} message
 * @param {number} fallback  Default status when no mapping matches (default 500)
 * @returns {number}
 */
export const errorStatus = (message, fallback = 500) => {
    const map = {
        "Course not found":                    404,
        "User not found":                      404,
        "Enrollment not found":                404,
        "Already enrolled in this course":     409,
        "You have already dropped this course":409,
        "User already exists":                 409,
        "Course is full":                      400,
        "Course title is required":            400,
        "Capacity must be at least 1":         400,
        "Forbidden":                           403,
        "Unauthorized":                        401,
        "Invalid email or password":           401,
        "Invalid or expired Google token":     401,
    };

    // Dynamic conflict messages start with "Schedule conflict:"
    if (message?.startsWith("Schedule conflict:")) return 409;

    return map[message] ?? fallback;
};
