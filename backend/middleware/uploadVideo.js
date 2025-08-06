import multer from "multer";
import path from "path";

// Aceitar apenas .mp4
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `video-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Apenas vídeos .mp4 são permitidos"));
  }
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // Limite de tamanho (15MB máx)
});
