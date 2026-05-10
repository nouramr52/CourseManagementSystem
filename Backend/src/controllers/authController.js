import { registerUser, loginUser, googleAuthUser, completeUserProfile } from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

export const googleCallback = async (req, res) => {
    try {
        const { access_token } = req.body;
        if (!access_token) {
            return res.status(400).json({ message: "Missing access_token" });
        }
        const result = await googleAuthUser(access_token);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

export const completeProfile = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ message: "Missing userId or role" });
        }
        const result = await completeUserProfile(userId, role);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
