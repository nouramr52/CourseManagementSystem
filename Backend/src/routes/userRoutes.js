import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protected route
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({
        message: "Dashboard accessed",
        user: req.user
    });
});

export default router;