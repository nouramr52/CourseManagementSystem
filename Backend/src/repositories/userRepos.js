import prisma from "../config/db.js";

export const createUser = (data) => {
    return prisma.user.create({ data });
};

export const findUserByEmail = (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

export const findOrCreateGoogleUser = async ({ email, name }) => {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name,
                password: null,
                role: "STUDENT", // temporary — will be updated on complete-profile
            },
        });
        return { user, isNewUser: true };
    }

    return { user, isNewUser: false };
};

export const updateUserRole = (id, role) => {
    return prisma.user.update({
        where: { id },
        data: { role },
    });
};