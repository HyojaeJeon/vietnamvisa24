// routes/uploadPassportImage.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 1) 업로드된 이미지 읽기
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    // 2) 요청 페이로드 구성
    const contents = [
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageBase64,
        },
      },
      {
        text: "Please evaluate whether the provided image adheres to the following passport photo regulations: Direct Gaze: The face and shoulders must be directed straight towards the camera. Side poses are not permitted. Neutral Expression: The mouth must be closed, and the expression should be neutral, without smiling or frowning. No Headwear/Accessories: Hats, hair ornaments, or any other accessories that cover the head or face are prohibited. Glasses: Clear-lensed glasses are permissible only if they do not obscure the eyes and have no reflections. Translucent lenses, colored lenses (including sunglasses), or frames that obscure the eyes are not allowed. No Photo Manipulation: Photos that have been artificially altered or composited using Photoshop, filters, or similar tools are not acceptable. The photo must be true to its original state. Size and Quality: The image must be high-resolution (at least 300dpi). (The AI should infer this information from the image data, or this condition might be pre-verified by the upload system.) Clear selfies with a clean background are also acceptable. Respond with 'SUITABLE' if all regulations are perfectly met, and 'UNSUITABLE' if even one is violated.",
      },
    ]; // 3) Gemini API 호출
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro-latest",
      contents: contents,
    });
    const fullText = response.text;
    console.log("전체 텍스트:", fullText);

    // 응답에서 SUITABLE 또는 UNSUITABLE 추출
    let result = "UNSUITABLE"; // 기본값
    if (fullText.includes("SUITABLE") && !fullText.includes("UNSUITABLE")) {
      result = "SUITABLE";
    } else if (fullText.includes("UNSUITABLE")) {
      result = "UNSUITABLE";
    }

    // // 4) 임시 파일 삭제
    // fs.unlink(imagePath, (err) => {
    //   if (err) console.warn("Failed to delete temp image:", err);
    // });

    return res.json({ result: result, fullText: fullText });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return res.status(500).json({ error: "Extraction failed" });
  }
});

module.exports = router;
