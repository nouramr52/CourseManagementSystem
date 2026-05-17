import nodemailer from 'nodemailer';

// Create transporter for sending emails
// For development, we'll use a test account from Ethereal
// For production, use a real email service like Gmail, SendGrid, etc.

let transporter;

// Initialize email transporter
export const initializeEmailService = async () => {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Production: Use real email service
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } else {
        // Development: Use Ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('📧 Using Ethereal test email account:', testAccount.user);
    }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
    if (!transporter) {
        console.log('⚠️ Transporter not initialized, initializing now...');
        await initializeEmailService();
    }

    console.log('📧 Preparing to send email to:', email);
    console.log('📧 Email config:', {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        user: process.env.EMAIL_USER || 'test',
        from: process.env.EMAIL_FROM || 'noreply@coursemanagement.com'
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Course Management System" <noreply@coursemanagement.com>',
        to: email,
        subject: 'Verify Your Email - OTP Code',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .otp-box { background: white; border: 2px dashed #4f46e5; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                    .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📚 Course Management System</h1>
                        <p>Email Verification</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>Thank you for signing up. To complete your registration, please verify your email address using the OTP code below:</p>
                        
                        <div class="otp-box">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
                            <div class="otp-code">${otp}</div>
                            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">Valid for 10 minutes</p>
                        </div>
                        
                        <p><strong>Important:</strong></p>
                        <ul>
                            <li>This code will expire in 10 minutes</li>
                            <li>Do not share this code with anyone</li>
                            <li>If you didn't request this, please ignore this email</li>
                        </ul>
                        
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Course Management System. All rights reserved.</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hello ${name}!\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    };

    try {
        console.log('📤 Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        
        // For development with Ethereal, log the preview URL
        if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_HOST) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('📧 Preview URL:', previewUrl);
        }
        
        return info;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        console.error('Error details:', error.message);
        throw error;
    }
};

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate OTP expiry time (10 minutes from now)
export const getOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
