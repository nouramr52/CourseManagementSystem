import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ THIS LINE IS CRITICAL
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

