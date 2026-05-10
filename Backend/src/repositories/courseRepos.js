import prisma from "../config/db.js";

export const createCourse = (data) => {
    return prisma.course.create({ data });
};

export const getCoursesByInstructor = (instructorId) => {
    return prisma.course.findMany({
        where: { instructorId },
        orderBy: { createdAt: "desc" },
    });
};

export const getAllCourses = () => {
    return prisma.course.findMany({
        include: { instructor: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const getCourseById = (id) => {
    return prisma.course.findUnique({ where: { id } });
};

export const deleteCourse = (id) => {
    return prisma.course.delete({ where: { id } });
};
