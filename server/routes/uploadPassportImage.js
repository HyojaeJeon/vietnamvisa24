const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// 업로드된 이미지 임시 저장 폴더
const upload = multer({ dest: path.join(__dirname, "../uploads/") });
const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  const imgPath = req.file.path;

  const pythonCmd = "C:\\Users\\Admin\\miniconda3\\python.exe";

  // Python 스크립트 절대 경로 지정
  const scriptPath = path.resolve(__dirname, "../scripts/passport_extractor.py");

  execFile(pythonCmd, [scriptPath, imgPath], (err, stdout, stderr) => {
    // 업로드된 이미지 파일 삭제
    // fs.unlink(imgPath, (unlinkErr) => {
    //   if (unlinkErr) console.warn("Failed to delete temp image:", unlinkErr);
    // });

    if (err) {
      console.error("Python script error:", err);
      return res.status(500).json({ error: "Extraction failed" });
    }

    try {
      const result = JSON.parse(stdout);
      return res.json(result);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ error: "Invalid JSON response" });
    }
  });
});

module.exports = router;
