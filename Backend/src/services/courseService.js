import {
    createCourse,
    getCoursesByInstructor,
    getAllCourses,
    getCourseById,
    deleteCourse,
} from "../repositories/courseRepos.js";

export const addCourse = async ({ title, description, instructorId }) => {
    if (!title) throw new Error("Course title is required");
    return createCourse({ title, description, instructorId });
};

export const getMyCourses = (instructorId) => {
    return getCoursesByInstructor(instructorId);
};

export const fetchAllCourses = () => {
    return getAllCourses();
};

export const removeCourse = async (courseId, requesterId) => {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.instructorId !== requesterId) throw new Error("Forbidden");
    return deleteCourse(courseId);
};
