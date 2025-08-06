const upload = multer({ dest: "uploads/" });

const uploadFields = upload.fields([
  { name: "images", maxCount: 3 },   // múltiplas imagens (até 3)
  { name: "video", maxCount: 1 },    // 1 vídeo opcional
]);
