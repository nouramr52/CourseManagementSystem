import express from "express";

const router = express.Router();

// MUST match frontend: /signup
router.post("/signup", (req, res) => {
    res.json({ message: "Signup works" });
});

export default router;