const models = require("../models");

async function testModels() {
  try {
    console.log("🔍 모델 테스트 시작...");

    // 모델들 확인
    console.log("VisaApplication:", !!models.VisaApplication);
    console.log("Document:", !!models.Document);
    console.log("AdditionalService:", !!models.AdditionalService);

    // 테스트 데이터 생성 시도
    if (models.VisaApplication) {
      console.log("✅ VisaApplication 모델 로드 성공");

      // 기존 신청서 확인
      const existingApps = await models.VisaApplication.findAll({
        limit: 5,
        include: [
          {
            model: models.Document,
            as: "documents",
            required: false,
          },
          {
            model: models.AdditionalService,
            as: "additionalServices",
            required: false,
          },
        ],
      });

      console.log(`📊 기존 신청서 수: ${existingApps.length}`);

      if (existingApps.length > 0) {
        const firstApp = existingApps[0];
        console.log(`📄 첫 번째 신청서 ID: ${firstApp.id}`);
        console.log(`📄 Documents: ${firstApp.documents?.length || 0}개`);
        console.log(
          `🎯 Services: ${firstApp.additionalServices?.length || 0}개`,
        );
      }
    }
  } catch (error) {
    console.error("❌ 모델 테스트 실패:", error);
  }
}

testModels();
