/**
 * authService.js — Authentication business logic
 *
 * Uses:
 *  - Factory Pattern (createAuthResponse) — no duplicated token/response building
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 *  - Repository Pattern — data access delegated to userRepos
 */

import bcrypt from "bcrypt";

import { createAuthResponse } from "../utils/authFactory.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findOrCreateGoogleUser, updateUserRole, updateUserOTP } from "../repositories/userRepos.js";
import supabase from "../config/supabase.js";
import { sendOTPEmail, generateOTP, getOTPExpiry } from "../config/email.js";

// ─── REGISTER ──────────────────────────────────────────────────────────────

export const registerUser = async (data) => {
    const { name, email, password, role } = data;

    const existingUser = await findUserByEmail(email);
    
    // If user exists and is already verified, they can't register again
    if (existingUser && existingUser.isEmailVerified) {
        throw new Error("User already exists. Please login instead.");
    }
    
    // If user exists but is NOT verified, resend OTP and allow them to verify
    if (existingUser && !existingUser.isEmailVerified) {
        // Generate new OTP
        const otp = generateOTP();
        const otpExpiresAt = getOTPExpiry();
        
        // Update user with new OTP
        await updateUserOTP(email, otp, otpExpiresAt);
        
        // Send OTP email
        try {
            await sendOTPEmail(email, otp, existingUser.name);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
        }
        
        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET
        );
        
        return {
            user: { 
                id: existingUser.id, 
                name: existingUser.name, 
                email: existingUser.email, 
                role: existingUser.role, 
                createdAt: existingUser.createdAt,
                isEmailVerified: existingUser.isEmailVerified
            },
            token,
            message: 'Account exists but not verified. New OTP sent to your email.'
        };
    }

    // New user registration
    const hashedPassword = await bcrypt.hash(password, 10);
<<<<<<< HEAD
    const newUser = await createUser({ name, email, password: hashedPassword, role });
=======

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    const newUser = await createUser({ 
        name, 
        email, 
        password: hashedPassword, 
        role,
        emailOtp: otp,
        otpExpiresAt: otpExpiresAt,
        isEmailVerified: false
    });

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        // Continue registration even if email fails
    }
>>>>>>> sherry

    // Observer: notify listeners a new user registered
    appEvents.emit(EVENTS.USER_REGISTERED, {
        userId: newUser.id,
        email:  newUser.email,
        role:   newUser.role,
    });

<<<<<<< HEAD
    return createAuthResponse(newUser);   // Factory
=======
    return {
        user: { 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role, 
            createdAt: newUser.createdAt,
            isEmailVerified: newUser.isEmailVerified
        },
        token,
        message: 'Registration successful! Please check your email for OTP verification.'
    };
>>>>>>> sherry
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
