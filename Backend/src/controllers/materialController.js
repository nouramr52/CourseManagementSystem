import {
    uploadMaterial,
    editMaterial,
    getCourseMaterials,
    removeMaterial,
} from "../services/materialService.js";

// POST /api/materials
// Body: multipart/form-data — fields: title, courseId, type (optional for files)
// For LINK type: also include linkUrl field (no file)
export const uploadMaterialHandler = async (req, res) => {
    try {
        const { title, courseId, type, linkUrl } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({ message: "title and courseId are required" });
        }

        const material = await uploadMaterial({
            title,
            type: type?.toUpperCase() || null,
            courseId: parseInt(courseId),
            uploadedById: req.user.id,
            file: req.file || null,   // populated by multer for file uploads
            linkUrl: linkUrl || null,
        });

        res.status(201).json(material);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/materials/course/:courseId
export const getCourseMaterialsHandler = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const materials = await getCourseMaterials(courseId);
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/materials/:id
export const editMaterialHandler = async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const { title, linkUrl } = req.body;
        const updated = await editMaterial(materialId, req.user.id, { title, linkUrl });
        res.status(200).json(updated);
    } catch (err) {
        const status = err.message.startsWith("Forbidden") ? 403
            : err.message === "Material not found" ? 404
            : 400;
        res.status(status).json({ message: err.message });
    }
};

// DELETE /api/materials/:id
export const deleteMaterialHandler = async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const result = await removeMaterial(materialId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        const status = err.message.startsWith("Forbidden") ? 403
            : err.message === "Material not found" ? 404
            : 500;
        res.status(status).json({ message: err.message });
    }
};
