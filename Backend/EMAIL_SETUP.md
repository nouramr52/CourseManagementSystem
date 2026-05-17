# 📧 Email Configuration Guide

## For Development (Recommended)

**No configuration needed!** The system uses Ethereal (test email service) by default.

### How to use:
1. Leave email settings empty in your `.env` file
2. Start the backend server: `npm start`
3. Sign up for an account
4. Check the **backend console** for a message like:
   ```
   📧 Email sent! Preview URL: https://ethereal.email/message/xxxxx
   ```
5. **Click the URL** to see the email with your OTP code
6. Copy the OTP and verify your email

### Advantages:
- ✅ Works immediately, no setup required
- ✅ No Gmail account needed
- ✅ Perfect for testing
- ✅ Each developer can test independently

---

## For Production (Optional)

If you want to send **real emails** to actual email addresses:

### Option A: Team Gmail Account (Recommended)

Create a **shared Gmail account** for the project:

1. **Create a new Gmail account** (e.g., `coursemanagement.team@gmail.com`)
2. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Type "Course Management"
   - Copy the 16-character password
4. **Share credentials with team** (via secure channel, not Git!)
5. **Each team member adds to their local `.env`:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=coursemanagement.team@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   EMAIL_FROM="Course Management System <coursemanagement.team@gmail.com>"
   ```

### Option B: Use Your Own Gmail

Each team member can use their personal Gmail:

1. Enable 2-Factor Authentication on your Gmail
2. Generate an App Password
3. Add to your local `.env` file
4. **Don't share your credentials!**

---

## Setup Instructions for New Team Members

1. **Clone the repository**
2. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```
3. **Fill in database credentials** (ask team lead)
4. **Leave email settings empty** (for development)
5. **Start the server:** `npm start`
6. **Test signup** - check console for preview URL

---

## Troubleshooting

### "Failed to send OTP"
- Check backend console for detailed error
- Make sure email settings are correct (or empty for Ethereal)

### "Username and Password not accepted"
- You're using regular Gmail password instead of App Password
- Generate a new App Password from Google

### "Can't see the email"
- For Ethereal: Check backend console for preview URL
- For Gmail: Check spam folder

---

## Security Notes

⚠️ **NEVER commit `.env` to Git!**
- `.env` is in `.gitignore`
- Share credentials via secure channels (Slack DM, password manager, etc.)
- Use `.env.example` for documentation only (no real credentials)

---

## Questions?

Contact the team lead or check the main README.
