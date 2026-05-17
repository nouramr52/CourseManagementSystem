/**
 * authService.js — Authentication business logic
 *
 * Uses:
 *  - Factory Pattern (createAuthResponse) — no duplicated token/response building
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 *  - Repository Pattern — data access delegated to userRepos
 */

import bcrypt from "bcrypt";
import { createUser, findUserByEmail, findOrCreateGoogleUser, updateUserRole } from "../repositories/userRepos.js";
import { createAuthResponse } from "../utils/authFactory.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";
import supabase from "../config/supabase.js";

// ─── REGISTER ──────────────────────────────────────────────────────────────

export const registerUser = async (data) => {
    const { name, email, password, role } = data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword, role });

    // Observer: notify listeners a new user registered
    appEvents.emit(EVENTS.USER_REGISTERED, {
        userId: newUser.id,
        email:  newUser.email,
        role:   newUser.role,
    });

    return createAuthResponse(newUser);   // Factory
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────

export const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    if (!user.password) {
        throw new Error("This account uses Google sign-in. Please continue with Google.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Invalid email or password");

    return createAuthResponse(user);   // Factory
};

// ─── GOOGLE AUTH ───────────────────────────────────────────────────────────

export const googleAuthUser = async (accessToken) => {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);

    if (error || !supabaseUser) throw new Error("Invalid or expired Google token");

    const email = supabaseUser.email;
    const name  = supabaseUser.user_metadata?.full_name
               || supabaseUser.user_metadata?.name
               || email.split("@")[0];

    const { user, isNewUser } = await findOrCreateGoogleUser({ email, name });

    if (isNewUser) {
        appEvents.emit(EVENTS.USER_REGISTERED, {
            userId: user.id,
            email:  user.email,
            role:   user.role,
        });
    }

    return { ...createAuthResponse(user), isNewUser };   // Factory
};

// ─── COMPLETE PROFILE ──────────────────────────────────────────────────────

export const completeUserProfile = async (userId, role) => {
    const allowedRoles = ["STUDENT", "INSTRUCTOR"];
    const normalizedRole = role?.toUpperCase();

    if (!allowedRoles.includes(normalizedRole)) {
        throw new Error("Invalid role. Must be STUDENT or INSTRUCTOR.");
    }

    const user = await updateUserRole(userId, normalizedRole);
    return createAuthResponse(user);   // Factory
};
