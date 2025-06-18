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
        text:
          "You are an OCR assistant specialized in passports. " +
          "Extract the following fields and return strictly as JSON (keys in snake_case): " +
          "type, issuing_country, passport_no, surname, given_names, date_of_birth, sex, " +
          "nationality, personal_no, date_of_issue, date_of_expiry, authority, korean_name. " +
          "If a field is not readable, use null.",
      },
    ];

    // 3) Gemini API 호출
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro-latest",
      contents: contents,
    });
    const fullText = response.text;
    console.log("전체 텍스트:", fullText);

    // JSON 추출 (```json ... ``` 형식 처리)
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : fullText;
    const extracted = JSON.parse(jsonString);

    // // 4) 임시 파일 삭제
    // fs.unlink(imagePath, (err) => {
    //   if (err) console.warn("Failed to delete temp image:", err);
    // });

    return res.json(extracted);
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return res.status(500).json({ error: "Extraction failed" });
  }
});

module.exports = router;
