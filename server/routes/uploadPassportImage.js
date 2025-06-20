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

// 기존 이미지를 기반으로 정보 추출 (새로운 엔드포인트)
router.post("/from-url", async (req, res) => {
  try {
    const { imageUrl, applicationId } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "이미지 URL이 필요합니다" });
    }

    if (!applicationId) {
      return res.status(400).json({ error: "신청서 ID가 필요합니다" });
    }

    console.log("📷 이미지 URL로부터 여권 정보 추출:", imageUrl);

    // 1) 서버에 저장된 이미지 파일 읽기
    let imagePath;
    if (imageUrl.startsWith("/uploads/")) {
      // 상대 경로인 경우 절대 경로로 변환
      imagePath = path.join(__dirname, "../", imageUrl);
    } else {
      return res.status(400).json({ error: "유효하지 않은 이미지 URL입니다" });
    }

    // 파일 존재 확인
    if (!fs.existsSync(imagePath)) {
      console.log("❌ 파일을 찾을 수 없음:", imagePath);
      return res.status(404).json({ error: "이미지 파일을 찾을 수 없습니다" });
    }

    // 2) 이미지 파일 읽기 및 Base64 변환
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    // MIME 타입 추론
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";

    // 3) Gemini API 호출
    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      },
      {
        text:
          "You are an OCR assistant specialized in passports. " +
          "Extract the following fields and return strictly as JSON (keys in camelCase): " +
          "type, issuingCountry, passportNo, surname, givenNames, dateOfBirth, sex, " +
          "nationality, personalNo, dateOfIssue, dateOfExpiry, authority, koreanName. " +
          "If a field is not readable, use null.",
      },
    ];

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

    console.log("✅ 여권 정보 추출 완료:", extracted);

    // 4) 데이터베이스에 저장
    const models = require("../models");
    const { VisaApplication, Document } = models;

    // 해당 신청서의 여권 문서 찾기
    const passportDocument = await Document.findOne({
      where: {
        applicationId: applicationId,
        type: "passport",
      },
    });

    if (passportDocument) {
      // extractedInfo를 JSON으로 저장
      await passportDocument.update({
        extractedInfo: JSON.stringify(extracted),
      });
      console.log("✅ 여권 추출 정보 DB 저장 완료");
    }

    // 5) 업데이트된 신청서 데이터 조회 (GetApplication 쿼리와 동일한 형태)
    const application = await VisaApplication.findByPk(applicationId, {
      include: [
        {
          model: Document,
          as: "documents",
          required: false,
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ error: "신청서를 찾을 수 없습니다" });
    }

    // GraphQL 응답과 동일한 형태로 변환
    const dbToGraphQLStatus = (dbStatus) => {
      const statusMapping = {
        pending: "PENDING",
        processing: "PROCESSING",
        document_review: "DOCUMENT_REVIEW",
        submitted_to_authority: "SUBMITTED_TO_AUTHORITY",
        approved: "APPROVED",
        rejected: "REJECTED",
        completed: "COMPLETED",
      };
      return statusMapping[dbStatus] || dbStatus.toUpperCase();
    };

    // 여권 문서에서 extractedInfo 가져오기
    let applicationExtractedInfo = null;
    const updatedPassportDocument = application.documents?.find(
      (doc) => doc.type === "passport",
    );
    if (updatedPassportDocument && updatedPassportDocument.extractedInfo) {
      try {
        applicationExtractedInfo =
          typeof updatedPassportDocument.extractedInfo === "string"
            ? JSON.parse(updatedPassportDocument.extractedInfo)
            : updatedPassportDocument.extractedInfo;
      } catch (parseError) {
        console.warn(
          `⚠️ Application extractedInfo 파싱 실패:`,
          parseError.message,
        );
        applicationExtractedInfo = null;
      }
    }

    const applicationResponse = {
      id: application.id.toString(),
      applicationId: application.applicationId || `APP-${application.id}`,
      processingType: application.processingType || "STANDARD",
      totalPrice: application.totalPrice || 0,
      createdAt: application.createdAt,
      status: dbToGraphQLStatus(application.status),
      extractedInfo: applicationExtractedInfo,
      personalInfo: {
        id: application.id.toString(),
        firstName:
          application.firstName ||
          application.fullName?.split(" ")[0] ||
          "이름",
        lastName:
          application.lastName || application.fullName?.split(" ")[1] || "성",
        fullName:
          application.fullName ||
          `${application.firstName || ""} ${application.lastName || ""}`.trim(),
        email: application.email || "email@example.com",
        phone: application.phone || "010-0000-0000",
        address: application.address || "주소 정보 없음",
        phoneOfFriend: application.phoneOfFriend || null,
      },
      travelInfo: {
        id: application.id.toString(),
        entryDate: application.entryDate || application.arrivalDate,
        entryPort: application.entryPort || "인천국제공항",
        visaType: application.visaType || "E_VISA_GENERAL",
      },
      additionalServices: [],
      documents: (application.documents || []).map((doc) => {
        let parsedExtractedInfo = null;
        if (doc.extractedInfo) {
          try {
            parsedExtractedInfo =
              typeof doc.extractedInfo === "string"
                ? JSON.parse(doc.extractedInfo)
                : doc.extractedInfo;
          } catch (e) {
            console.warn("extractedInfo 파싱 실패:", e);
            parsedExtractedInfo = null;
          }
        }
        return {
          id: doc.id.toString(),
          type: doc.type,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          fileType: doc.fileType,
          uploadedAt: doc.uploadedAt || doc.createdAt,
          extractedInfo: parsedExtractedInfo,
          fileUrl: doc.filePath ? doc.filePath : null,
          fileData: doc.filePath ? null : doc.fileData,
        };
      }),
    };

    console.log("📤 GetApplication 형태로 응답 반환");
    return res.json({ application: applicationResponse });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return res
      .status(500)
      .json({ error: "Extraction failed", details: error.message });
  }
});

// 기존 파일 업로드 방식 (호환성 유지)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 1) 업로드된 이미지 읽기
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64"); // 2) 요청 페이로드 구성
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

    // 4) 임시 파일 삭제
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("Failed to delete temp image:", err);
    });

    return res.json(extracted);
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return res.status(500).json({ error: "Extraction failed" });
  }
});

module.exports = router;
