import { sendOTPEmail, generateOTP, getOTPExpiry } from '../config/email.js';
import { updateUserOTP, verifyUserOTP, getUserByEmail } from '../repositories/userRepos.js';

// ─── POST /api/auth/send-otp ───────────────────────────────────────────────
// Send OTP to user's email
export const sendOTPHandler = async (req, res) => {
    try {
        const { email, name } = req.body;

        console.log('📧 Send OTP request received for:', email);

        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = getOTPExpiry();

        console.log('🔢 Generated OTP:', otp);

        // Save OTP to database
        await updateUserOTP(email, otp, otpExpiresAt);
        console.log('💾 OTP saved to database');

        // Send OTP email
        await sendOTPEmail(email, otp, name);
        console.log('✅ OTP email sent successfully');

        res.status(200).json({ 
            message: 'OTP sent successfully to your email',
            email 
        });
    } catch (err) {
        console.error('❌ Error sending OTP:', err);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────
// Verify OTP and mark email as verified
export const verifyOTPHandler = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Get user
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Check if OTP matches
        if (user.emailOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        // Check if OTP expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Verify user
        await verifyUserOTP(email);

        res.status(200).json({ 
            message: 'Email verified successfully!',
            isEmailVerified: true 
        });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
    }
};

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────
// Resend OTP to user's email
export const resendOTPHandler = async (req, res) => {
    try {
        const { email } = req.body;

        console.log('🔄 Resend OTP request received for:', email);

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Get user
        const user = await getUserByEmail(email);
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('👤 User found:', user.name);

        // Check if already verified
        if (user.isEmailVerified) {
            console.log('✅ User already verified');
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiresAt = getOTPExpiry();

        console.log('🔢 Generated new OTP:', otp);

        // Update OTP in database
        await updateUserOTP(email, otp, otpExpiresAt);
        console.log('💾 OTP updated in database');

        // Send OTP email
        await sendOTPEmail(email, otp, user.name);
        console.log('✅ OTP email sent successfully to:', email);

        res.status(200).json({ 
            message: 'New OTP sent successfully to your email',
            email 
        });
    } catch (err) {
        console.error('❌ Error resending OTP:', err);
        console.error('Error details:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
    }
};
