import prisma from "../config/db.js";

// ─── HELPERS ───────────────────────────────────────────────────────────────

const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

const timesOverlap = (startA, endA, startB, endB) =>
    toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);

// Mark schedule slots that conflict with another slot on the same day
const markConflicts = (slots) => {
    return slots.map((slot) => {
        const sameDay = slots.filter((x) => x.id !== slot.id && x.day === slot.day);
        const conflict = sameDay.some((x) =>
            timesOverlap(slot.startTime, slot.endTime, x.startTime, x.endTime)
        );
        return { ...slot, conflict };
    });
};

// ─── STATS ─────────────────────────────────────────────────────────────────

// Returns summary counts for the instructor's Overview dashboard
export const fetchInstructorStats = async (instructorId) => {
    // Run all queries in parallel for speed
    const [courses, enrollmentCount, materialCount, scheduleSlots] = await Promise.all([
        // All courses owned by this instructor
        prisma.course.findMany({
            where: { instructorId },
            select: { id: true },
        }),

        // Total active enrollments across all instructor's courses
        prisma.enrollment.count({
            where: {
                course: { instructorId },
                status: "ACTIVE",
            },
        }),

        // Total materials across all instructor's courses
        prisma.material.count({
            where: { course: { instructorId } },
        }),

        // All schedule slots for conflict detection
        prisma.schedule.findMany({
            where: { course: { instructorId } },
        }),
    ]);

    const markedSlots = markConflicts(scheduleSlots);
    const conflictCount = markedSlots.filter((s) => s.conflict).length;

    return {
        totalCourses: courses.length,
        totalStudents: enrollmentCount,
        totalMaterials: materialCount,
        scheduleConflicts: conflictCount,
    };
};

// ─── SCHEDULE ──────────────────────────────────────────────────────────────

// Returns all schedule slots for the instructor's courses, with conflict flags
export const fetchInstructorSchedule = async (instructorId) => {
    const slots = await prisma.schedule.findMany({
        where: { course: { instructorId } },
        include: {
            course: { select: { id: true, title: true } },
        },
        orderBy: [
            { day: "asc" },
            { startTime: "asc" },
        ],
    });

    return markConflicts(slots);
};

// ─── STUDENTS ──────────────────────────────────────────────────────────────

// Returns all students enrolled in any of the instructor's courses
export const fetchInstructorStudents = async (instructorId) => {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            course: { instructorId },
            status: "ACTIVE",
        },
        include: {
            student: { select: { id: true, name: true, email: true } },
            course: { select: { id: true, title: true } },
        },
        orderBy: { enrollmentDate: "asc" },
    });

    return enrollments.map((e) => ({
        id: e.id,
        studentId: e.student.id,
        name: e.student.name,
        email: e.student.email,
        courseId: e.course.id,
        course: e.course.title,
        enrolled: e.enrollmentDate,
        status: e.status,
    }));
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────

// Returns the 20 most recent enrollments across the instructor's courses,
// shaped as notification objects.
export const fetchInstructorNotifications = async (instructorId) => {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            course: { instructorId },
        },
        include: {
            student: { select: { id: true, name: true } },
            course: { select: { id: true, title: true } },
        },
        orderBy: { enrollmentDate: "desc" },
        take: 20,
    });

    return enrollments.map((e) => ({
        id: e.id,
        type: e.status === "DROPPED" ? "drop" : "enroll",
        message: e.status === "DROPPED"
            ? `${e.student.name} dropped ${e.course.title}`
            : `${e.student.name} enrolled in ${e.course.title}`,
        course: e.course.title,
        student: e.student.name,
        time: e.enrollmentDate,
    }));
};
