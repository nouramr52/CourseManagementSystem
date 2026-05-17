/**
 * createCourse.js — DTO / input validation for course creation
 *
 * Interface Segregation Principle: validates only course-creation fields.
 * Open/Closed Principle: extend validation rules here without touching
 * the controller or service.
 */

const VALID_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;   // HH:MM 24-hour format

/**
 * Validate and sanitise the body of a POST /api/courses request.
 *
 * @param {object} body  Raw request body
 * @returns {{ title, description, capacity, dept, icon, schedules }}
 * @throws {Error} with a descriptive message if validation fails
 */
export const validateCreateCourse = (body) => {
    const { title, description, capacity, dept, icon, schedules } = body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
        throw new Error("Course title must be at least 2 characters");
    }

    const parsedCapacity = Number(capacity);
    if (!capacity || isNaN(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 500) {
        throw new Error("Capacity must be a number between 1 and 500");
    }

    // Validate each schedule slot if provided
    const validatedSchedules = [];
    if (Array.isArray(schedules)) {
        for (const slot of schedules) {
            // Skip incomplete slots silently (instructor may leave them blank)
            if (!slot.day && !slot.startTime && !slot.endTime) continue;

            if (!VALID_DAYS.includes(slot.day)) {
                throw new Error(`Invalid day "${slot.day}". Must be a full day name e.g. Monday`);
            }
            if (!TIME_REGEX.test(slot.startTime)) {
                throw new Error(`Invalid start time "${slot.startTime}". Use HH:MM format`);
            }
            if (!TIME_REGEX.test(slot.endTime)) {
                throw new Error(`Invalid end time "${slot.endTime}". Use HH:MM format`);
            }
            if (slot.startTime >= slot.endTime) {
                throw new Error(`Start time must be before end time for ${slot.day}`);
            }

            validatedSchedules.push({
                day:       slot.day,
                startTime: slot.startTime,
                endTime:   slot.endTime,
            });
        }
    }

    return {
        title:       title.trim(),
        description: description?.trim() || null,
        capacity:    parsedCapacity,
        dept:        dept?.trim()  || null,
        icon:        icon?.trim()  || null,
        schedules:   validatedSchedules,
    };
};
