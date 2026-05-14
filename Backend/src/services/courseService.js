import {
    createCourse,
    getAllCourses,
    getCourseById,
    getCoursesByInstructor,
    getSchedulesByInstructor,
    updateCourse,
    deleteCourse,
} from "../repositories/courseRepos.js";

// ─── HELPERS ───────────────────────────────────────────────────────────────

// Convert "HH:MM" string to total minutes — makes time comparison simple
const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

// Returns true if two time ranges overlap on the same day.
// Two slots overlap when: slotA starts before slotB ends AND slotA ends after slotB starts.
const timesOverlap = (startA, endA, startB, endB) => {
    return toMinutes(startA) < toMinutes(endB) &&
           toMinutes(endA)   > toMinutes(startB);
};

// ─── CREATE ────────────────────────────────────────────────────────────────

export const addCourse = async ({ title, description, capacity, instructorId, schedules, dept, icon }) => {
    if (!title || title.trim() === "") {
        throw new Error("Course title is required");
    }

    if (!capacity || capacity < 1) {
        throw new Error("Capacity must be at least 1");
    }

    // ── Schedule conflict check ──────────────────────────────────────────
    // Only run if the instructor provided at least one schedule slot
    if (schedules && schedules.length > 0) {

        // Get all existing schedule slots for this instructor's courses
        const existing = await getSchedulesByInstructor(instructorId);

        // Check each new slot against every existing slot
        for (const newSlot of schedules) {
            if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) continue;

            for (const existingSlot of existing) {
                // Only compare slots on the same day
                if (existingSlot.day !== newSlot.day) continue;

                if (timesOverlap(newSlot.startTime, newSlot.endTime,
                                 existingSlot.startTime, existingSlot.endTime)) {
                    // Conflict found — tell the instructor exactly which course clashes
                    throw new Error(
                        `Schedule conflict: ${newSlot.day} ${newSlot.startTime}–${newSlot.endTime} ` +
                        `overlaps with "${existingSlot.course.title}" ` +
                        `(${existingSlot.startTime}–${existingSlot.endTime})`
                    );
                }
            }
        }
    }

    // No conflicts — create the course
    return createCourse({ title, description, capacity, instructorId, schedules, dept, icon });
};

// ─── READ ──────────────────────────────────────────────────────────────────

// Return all courses — used by the public catalog page.
export const fetchAllCourses = () => {
    return getAllCourses();
};

// Return one course by id — used by the course detail page.
export const fetchCourseById = async (id) => {
    const course = await getCourseById(id);
    if (!course) throw new Error("Course not found");
    return course;
};

// Return only the courses owned by a specific instructor.
export const fetchMyCourses = (instructorId) => {
    return getCoursesByInstructor(instructorId);
};

// ─── UPDATE ────────────────────────────────────────────────────────────────

// Called when an instructor edits a course.
// Checks ownership: only the instructor who created it (or an admin) can edit.
export const editCourse = async (courseId, requesterId, requesterRole, data) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    // Admins can edit any course; instructors can only edit their own
    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    // Only allow updating safe fields — never let instructorId be changed here
    const { title, description, capacity } = data;
    return updateCourse(courseId, { title, description, capacity });
};

// ─── DELETE ────────────────────────────────────────────────────────────────

// Called when an instructor deletes a course.
// Same ownership check as edit.
export const removeCourse = async (courseId, requesterId, requesterRole) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    if (requesterRole !== "ADMIN" && course.instructorId !== requesterId) {
        throw new Error("Forbidden");
    }

    return deleteCourse(courseId);
};
