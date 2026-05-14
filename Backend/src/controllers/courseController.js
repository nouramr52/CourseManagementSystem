import {
    addCourse,
    fetchAllCourses,
    fetchCourseById,
    fetchMyCourses,
    editCourse,
    removeCourse,
} from "../services/courseService.js";

// ─── POST /api/courses ─────────────────────────────────────────────────────
// Create a new course.
// req.user is set by authMiddleware — contains { id, role } from the JWT.
export const createCourseHandler = async (req, res) => {
    try {
        const { title, description, capacity, schedules, dept, icon } = req.body;

        const course = await addCourse({
            title,
            description,
            capacity: Number(capacity),
            instructorId: req.user.id,
            schedules: schedules || [],   // array of { day, startTime, endTime }
            dept:  dept  || null,
            icon:  icon  || null,
        });

        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── GET /api/courses ──────────────────────────────────────────────────────
// Return all courses — used by the student course catalog.
export const getAllCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchAllCourses();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── GET /api/courses/:id ──────────────────────────────────────────────────
// Return one course with full details.
export const getCourseByIdHandler = async (req, res) => {
    try {
        const course = await fetchCourseById(Number(req.params.id));
        res.status(200).json(course);
    } catch (err) {
        const status = err.message === "Course not found" ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

// ─── GET /api/courses/mine ─────────────────────────────────────────────────
// Return only the courses owned by the logged-in instructor.
export const getMyCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchMyCourses(req.user.id);
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── PUT /api/courses/:id ──────────────────────────────────────────────────
// Update a course. Only the owning instructor or an admin can do this.
export const updateCourseHandler = async (req, res) => {
    try {
        const course = await editCourse(
            Number(req.params.id),
            req.user.id,
            req.user.role,
            req.body
        );
        res.status(200).json(course);
    } catch (err) {
        const status = err.message === "Forbidden" ? 403
            : err.message === "Course not found" ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

// ─── DELETE /api/courses/:id ───────────────────────────────────────────────
// Delete a course. Only the owning instructor or an admin can do this.
export const deleteCourseHandler = async (req, res) => {
    try {
        await removeCourse(
            Number(req.params.id),
            req.user.id,
            req.user.role
        );
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        const status = err.message === "Forbidden" ? 403
            : err.message === "Course not found" ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};
