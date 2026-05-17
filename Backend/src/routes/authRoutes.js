import express from "express";
import { register, login, googleCallback, completeProfile } from "../controllers/authController.js";
import { sendOTPHandler, verifyOTPHandler, resendOTPHandler } from "../controllers/emailVerificationController.js";
import { forgotPasswordHandler, verifyResetOTPHandler, resetPasswordHandler } from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/google/callback", googleCallback);
router.patch("/complete-profile", completeProfile);

// Email verification routes
router.post("/send-otp", sendOTPHandler);
router.post("/verify-otp", verifyOTPHandler);
router.post("/resend-otp", resendOTPHandler);

// Password reset routes
router.post("/forgot-password", forgotPasswordHandler);
router.post("/verify-reset-otp", verifyResetOTPHandler);
router.post("/reset-password", resetPasswordHandler);

export default router;