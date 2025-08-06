// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "uploads/";
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);
