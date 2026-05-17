import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/api/auth",        authRoutes);
app.use("/api/courses",     courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/materials",   materialRoutes);
app.use("/api/instructor",  instructorRoutes);
app.use("/api/schedules",   scheduleRoutes);
app.use("/api/admin",       adminRoutes);

// Global error handler — must be registered LAST
app.use(errorMiddleware);

export default app;
