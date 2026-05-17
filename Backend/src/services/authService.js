/**
 * authService.js — Authentication business logic
 *
 * Uses:
 *  - Factory Pattern (createAuthResponse) — no duplicated token/response building
 *  - Observer Pattern (appEvents) — side effects decoupled from core logic
 *  - Repository Pattern — data access delegated to userRepos
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAuthResponse } from "../utils/authFactory.js";
import appEvents, { EVENTS } from "../utils/eventEmitter.js";
import { createUser, findUserByEmail, findOrCreateGoogleUser, updateUserRole, updateUserOTP } from "../repositories/userRepos.js";
import supabase from "../config/supabase.js";
import { sendOTPEmail, generateOTP, getOTPExpiry } from "../config/email.js";

// ─── REGISTER ──────────────────────────────────────────────────────────────

export const registerUser = async (data) => {
    const { name, email, password, role } = data;

    const existingUser = await findUserByEmail(email);

    // If user exists and is already verified, block re-registration
    if (existingUser && existingUser.isEmailVerified) {
        throw new Error("User already exists. Please login instead.");
    }

    // If user exists but is NOT verified, resend OTP
    if (existingUser && !existingUser.isEmailVerified) {
        const otp = generateOTP();
        const otpExpiresAt = getOTPExpiry();
        await updateUserOTP(email, otp, otpExpiresAt);

        try {
            await sendOTPEmail(email, otp, existingUser.name);
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
        }

        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            user: {
                id:              existingUser.id,
                name:            existingUser.name,
                email:           existingUser.email,
                role:            existingUser.role,
                createdAt:       existingUser.createdAt,
                isEmailVerified: existingUser.isEmailVerified,
            },
            token,
            message: "Account exists but not verified. New OTP sent to your email.",
        };
    }

    // New user — hash password, generate OTP, create record
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    const newUser = await createUser({
        name,
        email,
        password: hashedPassword,
        role,
        emailOtp:        otp,
        otpExpiresAt,
        isEmailVerified: false,
    });

    try {
        await sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
    }

    appEvents.emit(EVENTS.USER_REGISTERED, {
        userId: newUser.id,
        email:  newUser.email,
        role:   newUser.role,
    });

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET
    );

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

    return createAuthResponse(user);
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

    return { ...createAuthResponse(user), isNewUser };
};

// ─── COMPLETE PROFILE ──────────────────────────────────────────────────────

export const completeUserProfile = async (userId, role) => {
    const allowedRoles = ["STUDENT", "INSTRUCTOR"];
    const normalizedRole = role?.toUpperCase();

    if (!allowedRoles.includes(normalizedRole)) {
        throw new Error("Invalid role. Must be STUDENT or INSTRUCTOR.");
    }

    const user = await updateUserRole(userId, normalizedRole);
    return createAuthResponse(user);
};

// ─── PASSWORD RESET ────────────────────────────────────────────────────────

// Step 1: Request password reset — send OTP to email
export const requestPasswordReset = async (email) => {
    const user = await findUserByEmail(email);
    
    if (!user) {
        throw new Error("No account found with this email address");
    }

    if (!user.isEmailVerified) {
        throw new Error("Please verify your email first before resetting password");
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();
    
    await updateUserOTP(email, otp, otpExpiresAt);

    try {
        await sendOTPEmail(email, otp, user.name, "Password Reset");
    } catch (emailError) {
        console.error("Failed to send password reset OTP:", emailError);
        throw new Error("Failed to send OTP email. Please try again.");
    }

    return {
        message: "Password reset OTP sent to your email. Please check your inbox.",
    };
};

// Step 2: Verify OTP for password reset
export const verifyResetOTP = async (email, otp) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("No account found with this email address");
    }

    if (!user.emailOtp || !user.otpExpiresAt) {
        throw new Error("No OTP found. Please request a new password reset.");
    }

    if (user.emailOtp !== otp) {
        throw new Error("Invalid OTP. Please try again.");
    }

    if (new Date() > user.otpExpiresAt) {
        throw new Error("OTP has expired. Please request a new password reset.");
    }

    return {
        message: "OTP verified successfully. You can now reset your password.",
        verified: true,
    };
};

// Step 3: Reset password with verified OTP
export const resetPassword = async (email, otp, newPassword) => {
    // Verify OTP again for security
    await verifyResetOTP(email, otp);

    const user = await findUserByEmail(email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await updateUserOTP(email, null, null);
    
    // Update password using Prisma directly (add this to userRepos if needed)
    const { updateUserPassword } = await import("../repositories/userRepos.js");
    await updateUserPassword(email, hashedPassword);

    appEvents.emit(EVENTS.PASSWORD_RESET, {
        userId: user.id,
        email: user.email,
    });

    return {
        message: "Password reset successfully. You can now login with your new password.",
    };
};
