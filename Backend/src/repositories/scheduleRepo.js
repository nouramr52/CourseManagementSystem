import prisma from "../config/db.js";

// ─── READ ──────────────────────────────────────────────────────────────────

// Get all schedules for a student based on their enrolled courses
export const getSchedulesByStudent = async (studentId) => {
    // Get all active enrollments for the student
    const enrollments = await prisma.enrollment.findMany({
        where: {
            studentId,
            status: "ACTIVE"
        },
        include: {
            course: {
                include: {
                    schedules: true,
                    instructor: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    // Flatten the schedules from all enrolled courses
    const schedules = [];
    for (const enrollment of enrollments) {
        for (const schedule of enrollment.course.schedules) {
            schedules.push({
                ...schedule,
                course: {
                    id: enrollment.course.id,
                    title: enrollment.course.title,
                    instructor: enrollment.course.instructor,
                    icon: enrollment.course.icon
                }
            });
        }
    }

    // Sort by day and time
    return sortSchedules(schedules);
};

// Get all schedules for an instructor based on their courses
export const getSchedulesByInstructor = async (instructorId) => {
    const courses = await prisma.course.findMany({
        where: { instructorId },
        include: {
            schedules: true
        }
    });

    // Flatten the schedules from all courses
    const schedules = [];
    for (const course of courses) {
        for (const schedule of course.schedules) {
            schedules.push({
                ...schedule,
                course: {
                    id: course.id,
                    title: course.title,
                    icon: course.icon
                }
            });
        }
    }

    return sortSchedules(schedules);
};

// Get all schedules in the system
export const getAllSchedulesFromDB = async () => {
    const schedules = await prisma.schedule.findMany({
        include: {
            course: {
                include: {
                    instructor: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    return sortSchedules(schedules);
};

// Get a single schedule by ID
export const getScheduleById = (scheduleId) => {
    return prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
            course: true
        }
    });
};

// Get all schedules for a specific course
export const getSchedulesByCourse = (courseId) => {
    return prisma.schedule.findMany({
        where: { courseId },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    icon: true
                }
            }
        }
    });
};

// ─── CREATE ────────────────────────────────────────────────────────────────

// Create a new schedule slot for a course
export const createSchedule = (courseId, scheduleData) => {
    return prisma.schedule.create({
        data: {
            courseId,
            day: scheduleData.day,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            room: scheduleData.room || null
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    icon: true
                }
            }
        }
    });
};

// ─── UPDATE ────────────────────────────────────────────────────────────────

// Update an existing schedule slot
export const updateSchedule = (scheduleId, scheduleData) => {
    return prisma.schedule.update({
        where: { id: scheduleId },
        data: {
            ...(scheduleData.day && { day: scheduleData.day }),
            ...(scheduleData.startTime && { startTime: scheduleData.startTime }),
            ...(scheduleData.endTime && { endTime: scheduleData.endTime }),
            ...(scheduleData.room !== undefined && { room: scheduleData.room })
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    icon: true
                }
            }
        }
    });
};

// ─── DELETE ────────────────────────────────────────────────────────────────

// Delete a schedule slot
export const deleteSchedule = (scheduleId) => {
    return prisma.schedule.delete({
        where: { id: scheduleId }
    });
};

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

// Sort schedules by day of week and start time
function sortSchedules(schedules) {
    const dayOrder = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
        'Sunday': 7
    };

    return schedules.sort((a, b) => {
        // First sort by day
        const dayDiff = (dayOrder[a.day] || 8) - (dayOrder[b.day] || 8);
        if (dayDiff !== 0) return dayDiff;

        // Then sort by start time
        const [aHour, aMin] = a.startTime.split(':').map(Number);
        const [bHour, bMin] = b.startTime.split(':').map(Number);
        const aMinutes = aHour * 60 + aMin;
        const bMinutes = bHour * 60 + bMin;
        
        return aMinutes - bMinutes;
    });
}
