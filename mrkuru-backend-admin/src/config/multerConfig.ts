import multer from "multer";

// Configure Multer to store files in memory (or you can use disk storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

export default upload;
