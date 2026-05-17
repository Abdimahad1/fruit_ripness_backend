import express from "express";
import multer from "multer";

import {
  analyzeFruit,
} from "../controllers/analyzeController.js";

const router = express.Router();

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// =====================================================
// ROUTE
// =====================================================

router.post(
  "/",
  upload.single("image"),
  analyzeFruit
);

export default router;