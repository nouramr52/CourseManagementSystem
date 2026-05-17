import { 
    requestPasswordReset, 
    verifyResetOTP, 
    resetPassword 
} from "../services/authService.js";

// ─── POST /api/auth/forgot-password ────────────────────────────────────────
// Step 1: User enters email, system sends OTP
export const forgotPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await requestPasswordReset(email);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── POST /api/auth/verify-reset-otp ───────────────────────────────────────
// Step 2: User enters OTP to verify identity
export const verifyResetOTPHandler = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const result = await verifyResetOTP(email, otp);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── POST /api/auth/reset-password ─────────────────────────────────────────
// Step 3: User enters new password after OTP verification
export const resetPasswordHandler = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ 
                message: "Email, OTP, and new password are required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters" 
            });
        }

        const result = await resetPassword(email, otp, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
