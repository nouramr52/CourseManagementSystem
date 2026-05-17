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

// ─── EMAIL VERIFICATION ────────────────────────────────────────────────────

export const getUserByEmail = (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

export const updateUserOTP = (email, otp, otpExpiresAt) => {
    return prisma.user.update({
        where: { email },
        data: {
            emailOtp: otp,
            otpExpiresAt: otpExpiresAt,
        },
    });
};

export const verifyUserOTP = (email) => {
    return prisma.user.update({
        where: { email },
        data: {
            isEmailVerified: true,
            emailOtp: null,
            otpExpiresAt: null,
        },
    });
};
