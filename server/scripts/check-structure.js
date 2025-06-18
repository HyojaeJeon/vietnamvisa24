const fs = require("fs");
const path = require("path");

console.log("🔍 프로젝트 구조 확인...");

// 모델 디렉토리 확인
const modelsDir = path.join(__dirname, "../models");
if (fs.existsSync(modelsDir)) {
  console.log("📁 models 디렉토리 존재");
  const modelFiles = fs.readdirSync(modelsDir);
  console.log("📄 모델 파일들:", modelFiles);
} else {
  console.log("❌ models 디렉토리가 없습니다");
}

// 특정 모델 파일들 확인
const requiredModels = [
  "VisaApplication.js",
  "Document.js",
  "AdditionalService.js",
  "ApplicationAdditionalService.js",
];

requiredModels.forEach((modelFile) => {
  const modelPath = path.join(modelsDir, modelFile);
  if (fs.existsSync(modelPath)) {
    console.log(`✅ ${modelFile} 존재`);
  } else {
    console.log(`❌ ${modelFile} 없음`);
  }
});

// GraphQL 리졸버 확인
const resolverPath = path.join(
  __dirname,
  "../graphql/resolvers/applications/index.js",
);
if (fs.existsSync(resolverPath)) {
  console.log("✅ Applications 리졸버 존재");
} else {
  console.log("❌ Applications 리졸버 없음");
}
