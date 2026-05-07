import {
    addCourse,
    getMyCourses,
    fetchAllCourses,
    removeCourse,
} from "../services/courseService.js";

// POST /api/courses
export const createCourseHandler = async (req, res) => {
    try {
        const { title, description } = req.body;
        const course = await addCourse({
            title,
            description,
            instructorId: req.user.id,
        });
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/courses/mine  — instructor's own courses
export const getMyCoursesHandler = async (req, res) => {
    try {
        const courses = await getMyCourses(req.user.id);
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/courses  — all courses (any authenticated user)
export const getAllCoursesHandler = async (req, res) => {
    try {
        const courses = await fetchAllCourses();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/courses/:id
export const deleteCourseHandler = async (req, res) => {
    try {
        await removeCourse(parseInt(req.params.id), req.user.id);
        res.status(200).json({ message: "Course deleted" });
    } catch (err) {
        const status = err.message === "Forbidden" ? 403
            : err.message === "Course not found" ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};
