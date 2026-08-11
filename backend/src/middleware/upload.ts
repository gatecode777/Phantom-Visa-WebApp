import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Please upload an image file (PNG, JPG, WEBP, HEIC, GIF, etc.) or PDF document."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const documentUploadFields = upload.fields([
  { name: "passportScan", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "nationalId", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "employerLetter", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
  { name: "supportingDocs", maxCount: 1 }
]);
