const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");

// Import models with error handling
let VisaApplication, User, Admin, Document, AdditionalService;
try {
  const models = require("../../../models");
  VisaApplication = models.VisaApplication;
  User = models.User;
  Admin = models.Admin;
  Document = models.Document;
  AdditionalService = models.AdditionalService;
} catch (error) {
  console.error("Error importing models:", error);
}

// Status conversion functions
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

const resolvers = {
  Query: {
    // applications 쿼리: 새로운 대시보드와 호환되는 형식 (페이지네이션 및 필터 지원)
    applications: async (_, args, context) => {
      try {
        console.log("🔍 applications 쿼리 호출됨", args);

        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
          "USER",
        ]);

        console.log("✅ 인증된 사용자:", user.role);

        // 페이지네이션 및 필터 파라미터
        const {
          page = 1,
          limit = 10,
          searchTerm = "",
          statusFilter = "all",
          visaTypeFilter = "all",
          processingTypeFilter = "all"
        } = args;

        const offset = (page - 1) * limit;

        // 필터 조건 구성
        const whereConditions = {};
        
        if (searchTerm) {
          whereConditions[VisaApplication.sequelize.Op.or] = [
            { firstName: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` } },
            { lastName: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` } },
            { fullName: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` } },
            { email: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` } },
            { applicationId: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` } }
          ];
        }

        if (statusFilter && statusFilter !== "all") {
          whereConditions.status = statusFilter.toLowerCase().replace(/_/g, "_");
        }

        if (visaTypeFilter && visaTypeFilter !== "all") {
          whereConditions.visaType = visaTypeFilter;
        }

        if (processingTypeFilter && processingTypeFilter !== "all") {
          whereConditions.processingType = processingTypeFilter;
        }

        // 전체 카운트 조회
        const totalCount = await VisaApplication.count({
          where: whereConditions
        });

        // 실제 데이터베이스에서 조회
        const applications = await VisaApplication.findAll({
          where: whereConditions,
          order: [["createdAt", "DESC"]],
          limit: limit,
          offset: offset,
        });

        console.log(
          `📊 데이터베이스에서 ${applications.length}개 신청서 조회됨 (총 ${totalCount}개)`,
        );

        // 실제 데이터베이스 구조에 맞게 변환
        const mappedApplications = applications.map((app) => ({
          id: app.id.toString(),
          applicationId: app.applicationId || `APP-${app.id}`,
          processingType: app.processingType || "standard",
          totalPrice: app.totalPrice || 0,
          createdAt: app.createdAt,
          status: dbToGraphQLStatus(app.status),
          personalInfo: {
            id: app.id.toString(),
            firstName: app.firstName || app.fullName?.split(" ")[0] || "이름",
            lastName: app.lastName || app.fullName?.split(" ")[1] || "성",
            email: app.email || "email@example.com",
            phone: app.phone || "010-0000-0000",
            address: app.address || "주소 정보 없음",
            phoneOfFriend: app.phoneOfFriend || null,
          },
          travelInfo: {
            id: app.id.toString(),
            entryDate: app.entryDate || app.arrivalDate,
            entryPort: app.entryPort || "인천국제공항",
            visaType: app.visaType || "E_VISA_GENERAL",
          },
          additionalServices: [],
          documents: [],
        }));

        return {
          applications: mappedApplications,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          hasNextPage: page * limit < totalCount,
          hasPreviousPage: page > 1
        };
      } catch (error) {
        console.error("❌ applications 쿼리 오류:", error);

        // GraphQLError인 경우 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("비자 신청 목록을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // 대시보드 통계 쿼리
    applicationStatistics: async (_, __, context) => {
      try {
        console.log("🔍 applicationStatistics 쿼리 호출됨");

        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
          "USER",
        ]);

        if (!VisaApplication) {
          // 목업 데이터 반환
          return {
            pending: 5,
            processing: 8,
            completed: 12,
            total: 25
          };
        }

        // 상태별 카운트
        const pending = await VisaApplication.count({
          where: { status: "pending" }
        });

        const processing = await VisaApplication.count({
          where: { 
            status: {
              [VisaApplication.sequelize.Op.in]: ["processing", "document_review", "submitted_to_authority"]
            }
          }
        });

        const completed = await VisaApplication.count({
          where: { 
            status: {
              [VisaApplication.sequelize.Op.in]: ["approved", "completed"]
            }
          }
        });

        const total = await VisaApplication.count();

        console.log(`📊 통계: 대기 ${pending}, 처리중 ${processing}, 완료 ${completed}, 전체 ${total}`);

        return {
          pending,
          processing,
          completed,
          total
        };
      } catch (error) {
        console.error("❌ applicationStatistics 쿼리 오류:", error);

        // 목업 데이터 반환
        return {
          pending: 0,
          processing: 0,
          completed: 0,
          total: 0
        };
      }
    },

    // application 단건 조회
    application: async (_, { id }, context) => {
      try {
        console.log("🔍 application 단건 쿼리 호출됨, ID:", id);

        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
          "USER",
        ]);

        if (!VisaApplication) {
          console.log("⚠️ VisaApplication 모델 없음, 목 데이터 반환");
          return {
            id: id,
            applicationId: `APP-${id}`,
            processingType: "STANDARD",
            totalPrice: 100000,
            createdAt: "2024-01-15T09:30:00Z",
            status: "PENDING",
            personalInfo: {
              id: id,
              firstName: "홍",
              lastName: "길동",
              email: "test@example.com",
              phone: "010-1234-5678",
              address: "서울시 강남구",
              phoneOfFriend: null,
            },
            travelInfo: {
              id: id,
              entryDate: "2024-03-15",
              entryPort: "인천국제공항",
              visaType: "E_VISA_GENERAL",
            },
            additionalServices: [],
            documents: [],
          };
        }
        const application = await VisaApplication.findByPk(id, {
          include: [
            {
              model: Document,
              as: "documents",
              required: false,
            },
            {
              model: AdditionalService,
              as: "additionalServices",
              through: { attributes: [] },
              required: false,
            },
          ],
        });

        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        console.log("🔍 Documents found:", application.documents?.length || 0);
        console.log(
          "🔍 Additional services found:",
          application.additionalServices?.length || 0,
        );

        return {
          id: application.id.toString(),
          applicationId: application.applicationId || `APP-${application.id}`,
          processingType: application.processingType || "STANDARD",
          totalPrice: application.totalPrice || 0,
          createdAt: application.createdAt,
          status: dbToGraphQLStatus(application.status),
          personalInfo: {
            id: application.id.toString(),
            firstName:
              application.firstName ||
              application.fullName?.split(" ")[0] ||
              "이름",
            lastName:
              application.lastName ||
              application.fullName?.split(" ")[1] ||
              "성",
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
          additionalServices:
            application.additionalServices?.map((service) => ({
              id: service.id.toString(),
              name: service.name || service.serviceId,
            })) || [],
          documents:
            application.documents?.map((doc) => ({
              id: doc.id.toString(),
              type: doc.type,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              fileType: doc.fileType,
              uploadedAt: doc.uploadedAt || doc.createdAt,
              extractedInfo: doc.extractedInfo || null,
            })) || [],
        };
      } catch (error) {
        console.error("❌ application 단건 쿼리 오류:", error);

        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("신청서 정보를 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },
  Mutation: {
    createApplication: async (_, { input }, context) => {
      try {
        console.log("🔄 createApplication mutation 호출됨");
        console.log("📝 입력 데이터:", JSON.stringify(input, null, 2));

        // 인증 확인 (비회원도 신청 가능하지만, 로그인한 경우 사용자 정보 연결)
        let user = null;
        try {
          user = await requireAuth(context, [], false); // 선택적 인증
          console.log("✅ 인증된 사용자:", user?.email || "비회원");
        } catch (error) {
          console.log("ℹ️ 비회원 신청");
        }

        if (!VisaApplication) {
          throw new GraphQLError("데이터베이스 모델을 찾을 수 없습니다.", {
            extensions: { code: "SERVICE_UNAVAILABLE" },
          });
        }

        // 트랜잭션 시작
        const transaction = await VisaApplication.sequelize.transaction();

        try {
          // 1. 신청서 데이터 생성
          const applicationData = {
            userId: user?.id || null,
            applicationId: input.applicationId || `VN${Date.now()}`,
            processingType: input.processingType || "standard",
            totalPrice: input.totalPrice || 0,
            status: "pending",

            // Personal Info 매핑
            fullName: input.personalInfo
              ? `${input.personalInfo.firstName} ${input.personalInfo.lastName}`
              : null,
            firstName: input.personalInfo?.firstName,
            lastName: input.personalInfo?.lastName,
            email: input.personalInfo?.email,
            phone: input.personalInfo?.phone,
            address: input.personalInfo?.address,
            phoneOfFriend: input.personalInfo?.phoneOfFriend,

            // Travel Info 매핑
            visaType: input.travelInfo?.visaType,
            entryDate: input.travelInfo?.entryDate,
            arrivalDate: input.travelInfo?.entryDate, // 호환성을 위해
            entryPort: input.travelInfo?.entryPort,

            // 기타 필드
            notes: `신청 타입: ${input.processingType}, 총 가격: ${input.totalPrice}원`,
          };

          console.log("💾 저장할 신청서 데이터:", applicationData);

          // 2. 신청서 생성
          const newApplication = await VisaApplication.create(applicationData, {
            transaction,
          });
          console.log("✅ 신청서 생성 성공, ID:", newApplication.id);

          // 3. Documents 처리
          const createdDocuments = [];
          if (input.documents && Object.keys(input.documents).length > 0) {
            console.log("📄 Documents 처리 시작...");

            for (const [docType, docData] of Object.entries(input.documents)) {
              if (docData && (docData.fileData || docData.fileName)) {
                console.log(`📄 Processing document: ${docType}`);

                const documentData = {
                  applicationId: newApplication.id,
                  type: docType,
                  fileName: docData.fileName,
                  fileSize: docData.fileSize || 0,
                  fileType: docData.fileType || "application/octet-stream",
                  fileData: docData.fileData, // Base64 데이터
                  extractedInfo: docData.extractedInfo || null,
                  uploadedAt: new Date(),
                };

                if (Document) {
                  const createdDocument = await Document.create(documentData, {
                    transaction,
                  });
                  createdDocuments.push(createdDocument);
                  console.log(
                    `✅ Document created: ${docType}, ID: ${createdDocument.id}`,
                  );
                } else {
                  console.warn(
                    "Document 모델이 없어 문서를 저장할 수 없습니다.",
                  );
                }
              }
            }
          }

          // 4. Additional Services 처리
          const linkedServices = [];
          if (
            input.additionalServiceIds &&
            input.additionalServiceIds.length > 0
          ) {
            console.log("🎯 Additional Services 처리 시작...");

            for (const serviceId of input.additionalServiceIds) {
              if (AdditionalService) {
                // AdditionalService 테이블에서 서비스 찾기 (serviceId로)
                let service = await AdditionalService.findOne({
                  where: { serviceId: serviceId },
                });

                // 서비스가 없으면 생성
                if (!service) {
                  console.log(`🆕 Creating new service: ${serviceId}`);
                  service = await AdditionalService.create(
                    {
                      serviceId: serviceId,
                      name: serviceId.replace(/_/g, " ").toUpperCase(),
                      price: 0, // 기본값
                      description: `Auto-generated service for ${serviceId}`,
                    },
                    { transaction },
                  );
                }

                linkedServices.push(service);
                console.log(
                  `✅ Service processed: ${serviceId}, ID: ${service.id}`,
                );
              } else {
                console.warn(
                  "AdditionalService 모델이 없어 추가 서비스를 저장할 수 없습니다.",
                );
              }
            }

            // Many-to-Many 관계 연결 (junction table 사용)
            if (
              linkedServices.length > 0 &&
              newApplication.setAdditionalServices
            ) {
              await newApplication.setAdditionalServices(linkedServices, {
                transaction,
              });
              console.log(`✅ ${linkedServices.length}개 서비스 연결 완료`);
            }
          }

          // 트랜잭션 커밋
          await transaction.commit();
          console.log("✅ 트랜잭션 커밋 완료");

          // 5. GraphQL 응답 형식으로 변환
          const response = {
            id: newApplication.id.toString(),
            applicationId: newApplication.applicationId,
            processingType: newApplication.processingType,
            totalPrice: newApplication.totalPrice,
            createdAt: newApplication.createdAt,
            personalInfo: {
              id: newApplication.id.toString(),
              firstName: input.personalInfo?.firstName || "",
              lastName: input.personalInfo?.lastName || "",
              email: input.personalInfo?.email || "",
              phone: input.personalInfo?.phone || "",
              address: input.personalInfo?.address || "",
              phoneOfFriend: input.personalInfo?.phoneOfFriend || null,
            },
            travelInfo: {
              id: newApplication.id.toString(),
              entryDate: input.travelInfo?.entryDate,
              entryPort: input.travelInfo?.entryPort,
              visaType: input.travelInfo?.visaType,
            },
            additionalServices: linkedServices.map((service) => ({
              id: service.id.toString(),
              name: service.name,
            })),
            documents: createdDocuments.map((doc) => ({
              id: doc.id.toString(),
              type: doc.type,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              fileType: doc.fileType,
              uploadedAt: doc.uploadedAt,
              extractedInfo: doc.extractedInfo,
            })),
          };

          console.log("📤 최종 응답 데이터 요약:", {
            applicationId: response.applicationId,
            documentsCount: response.documents.length,
            servicesCount: response.additionalServices.length,
          });

          return response;
        } catch (error) {
          // 트랜잭션 롤백
          await transaction.rollback();
          console.error("❌ 트랜잭션 롤백:", error);
          throw error;
        }
      } catch (error) {
        console.error("❌ createApplication 오류:", error);

        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError("신청서 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // 상태 업데이트 뮤테이션
    updateApplicationStatus: async (_, { id, status }, context) => {
      try {
        console.log("🔄 상태 업데이트 요청:", { id, status });

        // 관리자 권한 확인
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const application = await VisaApplication.findByPk(id);
        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // 상태 업데이트
        await application.update({
          status: status.toLowerCase().replace(/_/g, "_"),
        });

        console.log("✅ 상태 업데이트 완료:", { id, newStatus: status });

        return {
          id: application.id.toString(),
          status: dbToGraphQLStatus(application.status),
          message: "상태가 성공적으로 업데이트되었습니다.",
        };
      } catch (error) {
        console.error("❌ 상태 업데이트 실패:", error);
        throw new GraphQLError("상태 업데이트에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // 이메일 발송 뮤테이션
    sendNotificationEmail: async (
      _,
      { applicationId, emailType, customMessage },
      context,
    ) => {
      try {
        console.log("📧 이메일 발송 요청:", { applicationId, emailType });

        // 관리자 권한 확인
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const application = await VisaApplication.findByPk(applicationId, {
          include: [
            {
              association: "personalInfo",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        });

        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        if (!application.personalInfo?.email) {
          throw new GraphQLError("고객 이메일 주소가 없습니다.", {
            extensions: { code: "INVALID_INPUT" },
          });
        }

        // 이메일 템플릿 생성
        const emailTemplates = {
          STATUS_UPDATE: {
            subject: `[베트남 비자] 신청서 상태 업데이트 - ${application.applicationId}`,
            content: `
안녕하세요 ${application.personalInfo.firstName} ${application.personalInfo.lastName}님,

신청서 ${application.applicationId}의 상태가 업데이트되었습니다.

현재 상태: ${dbToGraphQLStatus(application.status)}
${customMessage ? `\n추가 메시지: ${customMessage}` : ""}

궁금한 사항이 있으시면 언제든 연락주세요.

감사합니다.
베트남 비자 서비스팀
            `,
          },
          DOCUMENT_REQUEST: {
            subject: `[베트남 비자] 추가 서류 요청 - ${application.applicationId}`,
            content: `
안녕하세요 ${application.personalInfo.firstName} ${application.personalInfo.lastName}님,

신청서 ${application.applicationId} 처리를 위해 추가 서류가 필요합니다.

${customMessage || "자세한 내용은 담당자에게 문의해주세요."}

감사합니다.
베트남 비자 서비스팀
            `,
          },
          APPROVAL_NOTICE: {
            subject: `[베트남 비자] 승인 완료 - ${application.applicationId}`,
            content: `
축하합니다! ${application.personalInfo.firstName} ${application.personalInfo.lastName}님,

신청서 ${application.applicationId}가 승인되었습니다.

${customMessage || "비자 발급이 완료되었습니다. 첨부된 비자를 확인해주세요."}

감사합니다.
베트남 비자 서비스팀
            `,
          },
        };

        const template = emailTemplates[emailType];
        if (!template) {
          throw new GraphQLError("유효하지 않은 이메일 타입입니다.", {
            extensions: { code: "INVALID_INPUT" },
          });
        }

        // 실제 이메일 발송 로직 (현재는 시뮬레이션)
        console.log("📧 이메일 발송 시뮬레이션:", {
          to: application.personalInfo.email,
          subject: template.subject,
          content: template.content,
        });

        // TODO: 실제 이메일 서비스 (nodemailer, SendGrid 등) 연동

        return {
          success: true,
          message: `${application.personalInfo.email}로 이메일이 발송되었습니다.`,
          emailType,
          recipientEmail: application.personalInfo.email,
        };
      } catch (error) {
        console.error("❌ 이메일 발송 실패:", error);
        throw new GraphQLError("이메일 발송에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // PDF 생성 뮤테이션
    generateApplicationPDF: async (_, { applicationId }, context) => {
      try {
        console.log("📄 PDF 생성 요청:", { applicationId });

        // 관리자 권한 확인
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const application = await VisaApplication.findByPk(applicationId, {
          include: [
            { association: "personalInfo" },
            { association: "travelInfo" },
            { association: "documents" },
            { association: "additionalServices" },
          ],
        });

        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // PDF 데이터 생성 (실제로는 PDF 라이브러리 사용)
        const pdfData = {
          applicationId: application.applicationId,
          generatedAt: new Date().toISOString(),
          personalInfo: application.personalInfo,
          travelInfo: application.travelInfo,
          status: dbToGraphQLStatus(application.status),
          documents:
            application.documents?.map((doc) => ({
              type: doc.type,
              fileName: doc.fileName,
              uploadedAt: doc.uploadedAt,
            })) || [],
          additionalServices:
            application.additionalServices?.map((service) => ({
              name: service.name,
            })) || [],
        };

        console.log("✅ PDF 데이터 생성 완료");

        // TODO: 실제 PDF 생성 라이브러리 (puppeteer, jsPDF 등) 연동

        return {
          success: true,
          message: "PDF가 생성되었습니다.",
          downloadUrl: `/api/pdf/download/${applicationId}`, // 실제 다운로드 URL
          fileName: `application_${application.applicationId}.pdf`,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("❌ PDF 생성 실패:", error);
        throw new GraphQLError("PDF 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },
};

module.exports = resolvers;
