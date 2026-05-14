import prisma from "../config/db.js";

// ─── CREATE ────────────────────────────────────────────────────────────────

export const createCourse = (data) => {
    const { title, description, capacity, instructorId, schedules, dept, icon } = data;

    return prisma.course.create({
        data: {
            title,
            description,
            capacity,
            instructorId,
            dept:  dept  || null,
            icon:  icon  || null,
            // If schedules were provided, create them in the same DB transaction
            schedules: schedules?.length > 0
                ? { create: schedules.map(s => ({
                    day: s.day,
                    startTime: s.startTime,
                    endTime: s.endTime,
                })) }
                : undefined,
        },
        // Return the created course with its schedules and instructor name
        include: {
            schedules: true,
            instructor: { select: { id: true, name: true } },
        },
    });
};

// ─── READ ──────────────────────────────────────────────────────────────────

// Return every course, including the instructor's name and id.
// Used by the public course catalog (any logged-in user).
export const getAllCourses = () => {
    return prisma.course.findMany({
        include: {
            instructor: {
                select: { id: true, name: true }   // only expose safe fields
            },
            schedules: true,                        // include schedule slots
            _count: { select: { enrollments: true } } // how many students enrolled
        },
        orderBy: { createdAt: "desc" },
    });
};

// Return one course by its primary key.
// Used to check ownership before edit/delete, and for the detail page.
export const getCourseById = (id) => {
    return prisma.course.findUnique({
        where: { id },
        include: {
            instructor: { select: { id: true, name: true } },
            schedules: true,
            materials: true,
            _count: { select: { enrollments: true } }
        },
    });
};

// Return only the courses that belong to a specific instructor.
// Used in the Instructor Dashboard "My Courses" tab.
export const getCoursesByInstructor = (instructorId) => {
    return prisma.course.findMany({
        where: { instructorId },
        include: {
            schedules: true,
            instructor: { select: { id: true, name: true } },
            _count: { select: { enrollments: true } }
        },
        orderBy: { createdAt: "desc" },
    });
};

// Return all schedule slots that belong to a specific instructor
// (across all their courses). Used for conflict detection.
export const getSchedulesByInstructor = (instructorId) => {
    return prisma.schedule.findMany({
        where: {
            course: { instructorId }
        },
        include: {
            course: { select: { id: true, title: true } }
        }
    });
};

// Update any fields on a course by id.
// `data` can contain any subset of: { title, description, capacity }
export const updateCourse = (id, data) => {
    return prisma.course.update({
        where: { id },
        data,
    });
};

// ─── DELETE ────────────────────────────────────────────────────────────────

// Delete a course by id.
// Because Material and Schedule have onDelete: Cascade in the schema,
// their rows are automatically deleted too.
export const deleteCourse = (id) => {
    return prisma.course.delete({ where: { id } });
};
