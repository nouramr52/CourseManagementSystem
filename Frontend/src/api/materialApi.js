import api from "./axios.js";

// Upload a file material (PDF, PPT, DOC, ZIP)
// formData must contain: title, courseId, and file (the File object)
export const uploadFileMaterial = (formData, token) => {
    return api.post("/materials", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

// Upload a link material
export const uploadLinkMaterial = ({ title, courseId, linkUrl }, token) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("courseId", courseId);
    formData.append("type", "LINK");
    formData.append("linkUrl", linkUrl);

    return api.post("/materials", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

// Get all materials for a course
export const getCourseMaterials = (courseId, token) => {
    return api.get(`/materials/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Delete a material by ID
export const deleteMaterial = (materialId, token) => {
    return api.delete(`/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Edit a material (title and/or linkUrl)
export const editMaterial = (materialId, data, token) => {
    return api.patch(`/materials/${materialId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
