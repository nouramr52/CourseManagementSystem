import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../config/multer.js";
import {
    uploadMaterialHandler,
    editMaterialHandler,
    getCourseMaterialsHandler,
    deleteMaterialHandler,
} from "../controllers/materialController.js";

const router = express.Router();

// Upload a material (file or link) — INSTRUCTOR only
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["INSTRUCTOR", "ADMIN"]),
    upload.single("file"),
    uploadMaterialHandler
);

// Get all materials for a course — any authenticated user
router.get(
    "/course/:courseId",
    authMiddleware,
    getCourseMaterialsHandler
);

// Edit a material title / link URL — INSTRUCTOR only
router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["INSTRUCTOR", "ADMIN"]),
    editMaterialHandler
);

// Delete a material — INSTRUCTOR only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["INSTRUCTOR", "ADMIN"]),
    deleteMaterialHandler
);

export default router;
