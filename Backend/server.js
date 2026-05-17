import app from "./src/app.js";
import { initializeEmailService } from "./src/config/email.js";

const PORT = 5000;

// Initialize email service
initializeEmailService().then(() => {
    console.log('✅ Email service initialized');
}).catch((err) => {
    console.error('❌ Failed to initialize email service:', err);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});