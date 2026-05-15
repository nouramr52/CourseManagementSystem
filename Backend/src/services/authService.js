import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findOrCreateGoogleUser, updateUserRole } from "../repositories/userRepos.js";
import supabase from "../config/supabase.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;
    const role = data.role?.toUpperCase();

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET
    );

    return {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt },
        token
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.password) {
        throw new Error("This account uses Google sign-in. Please continue with Google.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
        token,
    };
};

export const googleAuthUser = async (accessToken) => {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);

    if (error || !supabaseUser) {
        throw new Error("Invalid or expired Google token");
    }

    const email = supabaseUser.email;
    const name = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || email.split("@")[0];

    const { user, isNewUser } = await findOrCreateGoogleUser({ email, name });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
        token,
        isNewUser,
    };
};

export const completeUserProfile = async (userId, role) => {
    const allowedRoles = ["STUDENT", "INSTRUCTOR"];
    const normalizedRole = role?.toUpperCase();

    if (!allowedRoles.includes(normalizedRole)) {
        throw new Error("Invalid role. Must be STUDENT or INSTRUCTOR.");
    }

    const user = await updateUserRole(userId, normalizedRole);

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
        token,
    };
};
