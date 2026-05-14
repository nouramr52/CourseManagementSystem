import {
    enrollStudent,
    dropCourse,
    getMyEnrollments,
    getStudentsInCourse,
} from "../services/enrollmentService.js";

// ─── POST /api/enrollments/:courseId ──────────────────────────────────────
// Student enrolls in a course.
// req.user.id is the student's id (set by authMiddleware from the JWT).
export const enrollHandler = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const studentId = req.user.id;

        const enrollment = await enrollStudent(studentId, courseId);
        res.status(201).json(enrollment);
    } catch (err) {
        // Map specific error messages to the right HTTP status codes
        const status =
            err.message === "Course not found"              ? 404 :
            err.message === "Already enrolled in this course" ? 409 :  // 409 = Conflict
            err.message === "Course is full"                ? 400 : 500;

        res.status(status).json({ message: err.message });
    }
};

// ─── PATCH /api/enrollments/:courseId/drop ─────────────────────────────────
// Student drops a course they are enrolled in.
export const dropHandler = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const studentId = req.user.id;

        const enrollment = await dropCourse(studentId, courseId);
        res.status(200).json(enrollment);
    } catch (err) {
        const status =
            err.message === "You are not enrolled in this course" ? 404 :
            err.message === "You have already dropped this course" ? 409 : 500;

        res.status(status).json({ message: err.message });
    }
};

// ─── GET /api/enrollments/my ───────────────────────────────────────────────
// Student gets all their enrolled courses.
export const getMyEnrollmentsHandler = async (req, res) => {
    try {
        const enrollments = await getMyEnrollments(req.user.id);
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── GET /api/enrollments/course/:courseId ─────────────────────────────────
// Instructor gets all students enrolled in one of their courses.
export const getCourseStudentsHandler = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const students = await getStudentsInCourse(
            courseId,
            req.user.id,
            req.user.role
        );
        res.status(200).json(students);
    } catch (err) {
        const status =
            err.message === "Course not found" ? 404 :
            err.message === "Forbidden"        ? 403 : 500;

        res.status(status).json({ message: err.message });
    }
};
