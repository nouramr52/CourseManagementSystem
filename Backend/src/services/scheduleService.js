import {
    getSchedulesByStudent,
    getSchedulesByInstructor,
    getAllSchedulesFromDB,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getSchedulesByCourse
} from "../repositories/scheduleRepo.js";

import { getCourseById } from "../repositories/courseRepos.js";

// ─── GET MY SCHEDULE ───────────────────────────────────────────────────────

// Get the user's schedule based on their role:
// - STUDENT: Get schedules for all enrolled courses
// - INSTRUCTOR: Get schedules for all courses they teach
// - ADMIN: Get all schedules
export const getMySchedule = async (userId, userRole) => {
    if (userRole === "STUDENT") {
        return getSchedulesByStudent(userId);
    } else if (userRole === "INSTRUCTOR") {
        return getSchedulesByInstructor(userId);
    } else if (userRole === "ADMIN") {
        return getAllSchedulesFromDB();
    }
    
    throw new Error("Invalid user role");
};

// ─── GET ALL SCHEDULES ─────────────────────────────────────────────────────

// Get all schedules in the system (admin only)
export const getAllSchedules = () => {
    return getAllSchedulesFromDB();
};

// ─── CREATE SCHEDULE ───────────────────────────────────────────────────────

// Create a new schedule slot for a course
// Only the course instructor or an admin can create schedules
export const createCourseSchedule = async (courseId, scheduleData, userId, userRole) => {
    // Check if course exists
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    // Check permissions
    if (userRole !== "ADMIN" && course.instructorId !== userId) {
        throw new Error("Forbidden");
    }

    // Validate time format (basic validation)
    if (!isValidTimeFormat(scheduleData.startTime) || !isValidTimeFormat(scheduleData.endTime)) {
        throw new Error("Invalid time format. Use HH:MM format (e.g., 10:00)");
    }

    // Check if end time is after start time
    if (!isEndTimeAfterStartTime(scheduleData.startTime, scheduleData.endTime)) {
        throw new Error("End time must be after start time");
    }

    // Create the schedule
    return createSchedule(courseId, scheduleData);
};

// ─── UPDATE SCHEDULE ───────────────────────────────────────────────────────

// Update an existing schedule slot
// Only the course instructor or an admin can update schedules
export const updateCourseSchedule = async (scheduleId, scheduleData, userId, userRole) => {
    // Get the schedule to check permissions
    const schedule = await getScheduleById(scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    // Get the course to check instructor
    const course = await getCourseById(schedule.courseId);
    
    // Check permissions
    if (userRole !== "ADMIN" && course.instructorId !== userId) {
        throw new Error("Forbidden");
    }

    // Validate time format if provided
    if (scheduleData.startTime && !isValidTimeFormat(scheduleData.startTime)) {
        throw new Error("Invalid start time format. Use HH:MM format (e.g., 10:00)");
    }
    if (scheduleData.endTime && !isValidTimeFormat(scheduleData.endTime)) {
        throw new Error("Invalid end time format. Use HH:MM format (e.g., 10:00)");
    }

    // Check if end time is after start time (if both are provided)
    const startTime = scheduleData.startTime || schedule.startTime;
    const endTime = scheduleData.endTime || schedule.endTime;
    if (!isEndTimeAfterStartTime(startTime, endTime)) {
        throw new Error("End time must be after start time");
    }

    // Update the schedule
    return updateSchedule(scheduleId, scheduleData);
};

// ─── DELETE SCHEDULE ───────────────────────────────────────────────────────

// Delete a schedule slot
// Only the course instructor or an admin can delete schedules
export const deleteCourseSchedule = async (scheduleId, userId, userRole) => {
    // Get the schedule to check permissions
    const schedule = await getScheduleById(scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    // Get the course to check instructor
    const course = await getCourseById(schedule.courseId);
    
    // Check permissions
    if (userRole !== "ADMIN" && course.instructorId !== userId) {
        throw new Error("Forbidden");
    }

    // Delete the schedule
    return deleteSchedule(scheduleId);
};

// ─── CHECK SCHEDULE CONFLICTS ──────────────────────────────────────────────

// Check if enrolling in a course would create schedule conflicts
// Returns an array of conflicting courses
export const checkScheduleConflicts = async (studentId, newCourseId) => {
    // Get the student's current schedule
    const currentSchedule = await getSchedulesByStudent(studentId);
    
    // Get the new course's schedule
    const newCourseSchedules = await getSchedulesByCourse(newCourseId);
    
    const conflicts = [];
    
    // Check each schedule slot of the new course
    for (const newSlot of newCourseSchedules) {
        // Check against each existing schedule slot
        for (const existingSlot of currentSchedule) {
            // Skip if different days
            if (newSlot.day !== existingSlot.day) continue;
            
            // Check for time overlap
            if (hasTimeOverlap(
                newSlot.startTime, 
                newSlot.endTime,
                existingSlot.startTime,
                existingSlot.endTime
            )) {
                conflicts.push({
                    existingCourse: {
                        id: existingSlot.courseId,
                        title: existingSlot.course.title,
                        day: existingSlot.day,
                        startTime: existingSlot.startTime,
                        endTime: existingSlot.endTime
                    },
                    newCourse: {
                        id: newCourseId,
                        day: newSlot.day,
                        startTime: newSlot.startTime,
                        endTime: newSlot.endTime
                    }
                });
            }
        }
    }
    
    return conflicts;
};

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

// Validate time format (HH:MM)
function isValidTimeFormat(time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}

// Check if end time is after start time
function isEndTimeAfterStartTime(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes > startMinutes;
}

// Check if two time ranges overlap
function hasTimeOverlap(start1, end1, start2, end2) {
    const [start1Hour, start1Min] = start1.split(':').map(Number);
    const [end1Hour, end1Min] = end1.split(':').map(Number);
    const [start2Hour, start2Min] = start2.split(':').map(Number);
    const [end2Hour, end2Min] = end2.split(':').map(Number);
    
    const start1Minutes = start1Hour * 60 + start1Min;
    const end1Minutes = end1Hour * 60 + end1Min;
    const start2Minutes = start2Hour * 60 + start2Min;
    const end2Minutes = end2Hour * 60 + end2Min;
    
    // Two ranges overlap if one starts before the other ends
    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
}
