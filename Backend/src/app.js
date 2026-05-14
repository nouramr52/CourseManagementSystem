import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// Auth — signup, login, google
app.use("/api/auth", authRoutes);

// Courses — CRUD for courses
app.use("/api/courses", courseRoutes);

// Enrollments — enroll, drop, view
app.use("/api/enrollments", enrollmentRoutes);

export default app;
