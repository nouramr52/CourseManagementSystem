import multer from "multer";

// Allowed MIME types mapped to material types
const ALLOWED_MIME_TYPES = {
    "application/pdf": "PDF",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPT",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOC",
    "application/zip": "ZIP",
    "application/x-zip-compressed": "ZIP",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// Use memory storage — file goes into req.file.buffer, then we upload to Supabase
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type: ${file.mimetype}. Allowed types: PDF, PPT, DOC, ZIP`
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

export { ALLOWED_MIME_TYPES };
export default upload;
