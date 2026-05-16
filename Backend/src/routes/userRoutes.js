import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import prisma from "../config/db.js";

const router = express.Router();

// GET /api/users/me — returns the full logged-in user record from the DB
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/users/me — update the logged-in user's name
// Only name is updatable here (email changes require verification, role changes are admin-only)
router.patch("/me", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name: name.trim() },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Legacy dashboard route
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Dashboard accessed", user: req.user });
});

export default router;