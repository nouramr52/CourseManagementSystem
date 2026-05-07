import { registerUser, loginUser } from "../services/authService.js";

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