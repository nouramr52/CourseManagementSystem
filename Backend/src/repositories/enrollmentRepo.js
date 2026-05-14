import prisma from "../config/db.js";

// ─── CREATE ────────────────────────────────────────────────────────────────

// Insert a new enrollment row linking a student to a course.
export const createEnrollment = (studentId, courseId) => {
    return prisma.enrollment.create({
        data: { studentId, courseId },
    });
};

// ─── READ ──────────────────────────────────────────────────────────────────

// Find one enrollment by student + course combination.
// Used to check if a student is already enrolled before allowing a new enrollment.
export const findEnrollment = (studentId, courseId) => {
    return prisma.enrollment.findUnique({
        where: {
            studentId_courseId: { studentId, courseId }  // the @@unique index name Prisma generates
        },
    });
};

// Return all enrollments for one student, including course details.
// Used in the student "My Courses" page.
export const getEnrollmentsByStudent = (studentId) => {
    return prisma.enrollment.findMany({
        where: { studentId },
        include: {
            course: {
                include: {
                    instructor: { select: { id: true, name: true } },
                    schedules: true,
                }
            }
        },
        orderBy: { enrollmentDate: "desc" },
    });
};

// Return all enrollments for one course, including student details.
// Used in the instructor "Students" tab.
export const getEnrollmentsByCourse = (courseId) => {
    return prisma.enrollment.findMany({
        where: { courseId },
        include: {
            student: { select: { id: true, name: true, email: true } }
        },
        orderBy: { enrollmentDate: "asc" },
    });
};

// Count how many active enrollments a course currently has.
// Used to check if the course is full before allowing a new enrollment.
export const countEnrollments = (courseId) => {
    return prisma.enrollment.count({
        where: { courseId, status: "ACTIVE" },
    });
};

// ─── UPDATE ────────────────────────────────────────────────────────────────

// Change the status of an enrollment (e.g. ACTIVE → DROPPED).
export const updateEnrollmentStatus = (studentId, courseId, status) => {
    return prisma.enrollment.update({
        where: {
            studentId_courseId: { studentId, courseId }
        },
        data: { status },
    });
};
