import supabase from "../config/supabase.js";
import { ALLOWED_MIME_TYPES } from "../config/multer.js";
import {
    createMaterial,
    getMaterialsByCourse,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
} from "../repositories/materialRepo.js";

const BUCKET = process.env.SUPABASE_BUCKET || "bucket";

// ─── URL Validation ───────────────────────────────────────────────────────────
const isValidUrl = (str) => {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

// ─── Upload Material (file or link) ──────────────────────────────────────────
export const uploadMaterial = async ({ title, type, courseId, uploadedById, file, linkUrl }) => {
    // LINK type — validate URL, no file needed
    if (type === "LINK") {
        if (!linkUrl || !isValidUrl(linkUrl)) {
            throw new Error("A valid http/https URL is required for LINK type materials");
        }
        const material = await createMaterial({
            title,
            type: "LINK",
            url: linkUrl,
            storagePath: null,
            courseId,
            uploadedById,
        });
        return material;
    }

    // File types — require an actual uploaded file
    if (!file) {
        throw new Error("A file is required for non-link material types");
    }

    // Derive the material type from the MIME type
    const derivedType = ALLOWED_MIME_TYPES[file.mimetype];
    if (!derivedType) {
        throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    // Build a unique storage path: materials/<courseId>/<timestamp>-<originalname>
    const storagePath = `materials/${courseId}/${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

    const material = await createMaterial({
        title,
        type: derivedType,
        url: urlData.publicUrl,
        storagePath,
        courseId,
        uploadedById,
    });

    return material;
};

// ─── Edit Material (title + link URL only) ───────────────────────────────────
export const editMaterial = async (materialId, requesterId, { title, linkUrl }) => {
    const material = await getMaterialById(materialId);
    if (!material) throw new Error("Material not found");
    if (material.uploadedById !== requesterId) throw new Error("Forbidden");

    const updates = {};
    if (title) updates.title = title;
    if (material.type === "LINK" && linkUrl) {
        if (!isValidUrl(linkUrl)) throw new Error("Invalid URL");
        updates.url = linkUrl;
    }

    return updateMaterial(materialId, updates);
};

// ─── Get Materials for a Course ───────────────────────────────────────────────
export const getCourseMaterials = async (courseId) => {
    return getMaterialsByCourse(courseId);
};

// ─── Delete Material ──────────────────────────────────────────────────────────
export const removeMaterial = async (materialId, requesterId) => {
    const material = await getMaterialById(materialId);

    if (!material) {
        throw new Error("Material not found");
    }

    // Only the instructor who uploaded it can delete it
    if (material.uploadedById !== requesterId) {
        throw new Error("Forbidden: you can only delete your own materials");
    }

    // If it's a file (not a link), remove it from Supabase Storage too
    if (material.storagePath) {
        const { error: deleteError } = await supabase.storage
            .from(BUCKET)
            .remove([material.storagePath]);

        if (deleteError) {
            // Log but don't block — DB record should still be removed
            console.error("Supabase Storage delete error:", deleteError.message);
        }
    }

    await deleteMaterial(materialId);
    return { message: "Material deleted successfully" };
};
