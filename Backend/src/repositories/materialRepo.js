import prisma from "../config/db.js";

export const createMaterial = (data) => {
    return prisma.material.create({ data });
};

export const getMaterialsByCourse = (courseId) => {
    return prisma.material.findMany({
        where: { courseId },
        include: {
            uploadedBy: {
                select: { id: true, name: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getMaterialById = (id) => {
    return prisma.material.findUnique({
        where: { id },
    });
};

export const updateMaterial = (id, data) => {
    return prisma.material.update({
        where: { id },
        data,
    });
};

export const deleteMaterial = (id) => {
    return prisma.material.delete({
        where: { id },
    });
};
