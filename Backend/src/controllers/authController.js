/**
 * authController.js — HTTP layer for authentication
 *
 * Responsibilities (SRP):
 *  - Parse and validate request input using DTOs
 *  - Delegate business logic to authService
 *  - Map results/errors to HTTP responses
 *
 * Controllers never contain business logic — that lives in services.
 */

import { registerUser, loginUser, googleAuthUser, completeUserProfile } from "../services/authService.js";
import { validateCreateUser } from "../dto/createUser.js";
import { errorStatus } from "../utils/helpers.js";

export const register = async (req, res, next) => {
    try {
        const validated = validateCreateUser(req.body);   // DTO validation
        const result    = await registerUser(validated);
        res.status(201).json(result);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(errorStatus(err.message, 401)).json({ message: err.message });
    }
};

export const googleCallback = async (req, res, next) => {
    try {
        const { access_token } = req.body;
        if (!access_token) {
            return res.status(400).json({ message: "Missing access_token" });
        }
        const result = await googleAuthUser(access_token);
        res.status(200).json(result);
    } catch (err) {
        res.status(errorStatus(err.message, 401)).json({ message: err.message });
    }
};

export const completeProfile = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ message: "Missing userId or role" });
        }
        const result = await completeUserProfile(userId, role);
        res.status(200).json(result);
    } catch (err) {
        res.status(errorStatus(err.message, 400)).json({ message: err.message });
    }
};
