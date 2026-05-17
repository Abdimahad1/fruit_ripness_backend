import {
  analyzeFruitWithGemini,
} from "../services/geminiService.js";

// =====================================================
// ANALYZE CONTROLLER
// =====================================================

export const analyzeFruit = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // =====================================================
    // IMAGE BUFFER
    // =====================================================

    const imageBuffer =
      req.file.buffer;

    const mimeType =
      req.file.mimetype;

    // =====================================================
    // GEMINI ANALYSIS
    // =====================================================

    const result =
      await analyzeFruitWithGemini(
        imageBuffer,
        mimeType
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};