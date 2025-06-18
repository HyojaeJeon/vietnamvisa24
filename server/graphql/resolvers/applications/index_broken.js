const { GraphQLError } = require("graphql");
const nodemailer = require("nodemailer");
const { getUserFromToken } = require("../../../utils/auth");
const { requireAuth } = require("../../../utils/requireAuth");
const {
  saveBase64File,
  validateFileType,
  validateFileSize,
} = require("../../../utils/fileUpload");

// Import models with error handling
let VisaApplication, User, Admin, ApplicationStatusHistory;
try {
  const models = require("../../../models");
  VisaApplication = models.VisaApplication;
  User = models.User;
  Admin = models.Admin;
  ApplicationStatusHistory = models.ApplicationStatusHistory;
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

const graphQLToDbStatus = (graphQLStatus) => {
  const statusMapping = {
    PENDING: "pending",
    PROCESSING: "processing",
    DOCUMENT_REVIEW: "document_review",
    SUBMITTED_TO_AUTHORITY: "submitted_to_authority",
    APPROVED: "approved",
    REJECTED: "rejected",
    COMPLETED: "completed",
  };
  return statusMapping[graphQLStatus] || graphQLStatus.toLowerCase();
};

const resolvers = {
  Query: {
    getVisaApplications: async (_, __, context) => {
      try {
        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        // 역할 기반 접근 제어
        let where = {};
        if (user.role === "STAFF") {
          where = {
            [User.sequelize.Op.or]: [
              { userId: user.id },
              { assignedTo: user.id },
            ],
          };
        } // SUPER_ADMIN, ADMIN, MANAGER는 전체 조회 가능

        const applications = await VisaApplication.findAll({
          where,
          include: [
            User ? { model: User, as: "applicant" } : null,
            User ? { model: User, as: "assignedUser" } : null,
          ].filter(Boolean),
          order: [["created_at", "DESC"]],
        });

        // Convert database status to GraphQL enum
        const convertedApplications = applications.map((app) => ({
          ...app.toJSON(),
          status: dbToGraphQLStatus(app.status),
        }));

        return convertedApplications;
      } catch (error) {
        console.error("getVisaApplications error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
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

    // applications 스키마 필드에 대한 리졸버 추가
    applications: async (_, __, context) => {
      try {
        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        // 역할 기반 접근 제어
        let where = {};
        if (user.role === "STAFF") {
          where = {
            [User.sequelize.Op.or]: [
              { userId: user.id },
              { assignedTo: user.id },
            ],
          };
        } // SUPER_ADMIN, ADMIN, MANAGER는 전체 조회 가능

        const applications = await VisaApplication.findAll({
          where,
          include: [
            User ? { model: User, as: "applicant" } : null,
            User ? { model: User, as: "assignedUser" } : null,
          ].filter(Boolean),
          order: [["created_at", "DESC"]],
        });

        // Convert database status to GraphQL enum
        const convertedApplications = applications.map((app) => ({
          ...app.toJSON(),
          status: dbToGraphQLStatus(app.status),
        }));

        return convertedApplications;
      } catch (error) {
        console.error("applications error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
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
    },    // applications 쿼리: 새로운 대시보드와 호환되는 형식
    applications: async (_, __, context) => {
      try {
        console.log("applications 쿼리 호출됨");

        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("인증된 사용자:", user.role);

        // 모델이 없는 경우 목 데이터 반환
        if (!VisaApplication) {
          console.log("VisaApplication 모델 없음, 목 데이터 반환");
          return [
            {
              id: "1",
              applicationId: "APP-2024-001",
              processingType: "STANDARD",
              totalPrice: 100000,
              createdAt: "2024-01-15T09:30:00Z",
              status: "PENDING",
              personalInfo: {
                id: "1",
                firstName: "민수",
                lastName: "김",
                email: "minsu@example.com",
                phone: "010-1234-5678",
                address: "서울시 강남구",
                phoneOfFriend: "010-9999-8888"
              },
              travelInfo: {
                id: "1",
                entryDate: "2024-03-15",
                entryPort: "인천국제공항",
                visaType: "E_VISA_GENERAL"
              },
              additionalServices: [],
              documents: []
            },
            {
              id: "2",
              applicationId: "APP-2024-002",
              processingType: "URGENT",
              totalPrice: 150000,
              createdAt: "2024-01-16T14:20:00Z",
              status: "PROCESSING",
              personalInfo: {
                id: "2",
                firstName: "영희",
                lastName: "이",
                email: "younghee@example.com",
                phone: "010-5678-1234",
                address: "서울시 서초구",
                phoneOfFriend: "010-8888-7777"
              },
              travelInfo: {
                id: "2",
                entryDate: "2024-03-20",
                entryPort: "김포국제공항",
                visaType: "E_VISA_URGENT"
              },
              additionalServices: [],
              documents: []
            }
          ];
        }

        // 실제 데이터베이스에서 조회
        const applications = await VisaApplication.findAll({
          order: [["createdAt", "DESC"]],
          limit: 20
        });

        console.log(`데이터베이스에서 ${applications.length}개 신청서 조회됨`);

        // 실제 데이터베이스 구조에 맞게 변환
        return applications.map((app) => ({
          id: app.id.toString(),
          applicationId: app.applicationId || `APP-${app.id}`,
          processingType: app.processingType || "STANDARD",
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
            phoneOfFriend: app.phoneOfFriend || null
          },
          travelInfo: {
            id: app.id.toString(),
            entryDate: app.entryDate || app.arrivalDate,
            entryPort: app.entryPort || "인천국제공항",
            visaType: app.visaType || "E_VISA_GENERAL"
          },
          additionalServices: [],
          documents: []
        }));

      } catch (error) {
        console.error("applications 쿼리 오류:", error);

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
            lastName: obj.fullName
              ? obj.fullName.split(" ").slice(0, -1).join(" ")
              : null,
            email: obj.email,
            phone: obj.phone,
            nationality: obj.nationality,
            birthDate: obj.birthDate,
            passportNumber: obj.passportNumber,
          },
          travelInfo: {
            entryDate: obj.arrivalDate,
            exitDate: obj.departure_date,
            visaType: obj.visa_type,
            purpose: obj.purpose,
          },
          // 추가 서비스, 서류 등은 추후 확장
        }));
      } catch (error) {
        console.error("applications error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("신청 목록을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    getVisaApplication: async (_, { id }, context) => {
      try {
        // 관리자 또는 스태프만 접근 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        if (!VisaApplication) {
          throw new GraphQLError("VisaApplication model not available");
        }

        const application = await VisaApplication.findByPk(id, {
          include: [
            User ? { model: User, as: "applicant" } : null,
            User ? { model: User, as: "assignedUser" } : null,
          ].filter(Boolean),
        });

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // 스태프는 자신이 담당하거나 신청한 것만 조회 가능
        if (user.role === "STAFF") {
          if (
            application.userId !== user.id &&
            application.assignedTo !== user.id
          ) {
            throw new GraphQLError("권한이 없습니다.", {
              extensions: { code: "FORBIDDEN" },
            });
          }
        }

        // Convert database status to GraphQL enum 및 personalInfo/travelInfo로 가공
        const obj = application.toJSON();
        return {
          id: obj.id,
          applicationId: obj.application_id,
          processingType: obj.processing_type,
          totalPrice: obj.total_price,
          createdAt: obj.created_at,
          status: dbToGraphQLStatus(obj.status),
          personalInfo: {
            firstName: obj.full_name
              ? obj.full_name.split(" ").slice(-1)[0]
              : null,
            lastName: obj.full_name
              ? obj.full_name.split(" ").slice(0, -1).join(" ")
              : null,
            email: obj.email,
            phone: obj.phone,
            nationality: obj.nationality,
            birthDate: obj.birth_date,
            passportNumber: obj.passport_number,
          },
          travelInfo: {
            entryDate: obj.arrival_date,
            exitDate: obj.departure_date,
            visaType: obj.visa_type,
            purpose: obj.purpose,
          },
          // 추가 서비스, 서류 등은 추후 확장
        };
      } catch (error) {
        console.error("Error fetching application:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("비자 신청 정보를 가져오는데 실패했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Mutation: {
    createApplication: async (_, { input }, context) => {
      try {
        console.log("🚀 Creating application with input:", {
          hasPersonalInfo: !!input.personalInfo,
          hasTravelInfo: !!input.travelInfo,
          applicationId: input.applicationId,
          processingType: input.processingType,
          totalPrice: input.totalPrice,
          hasDocuments: !!input.documents,
          documentTypes: input.documents ? Object.keys(input.documents) : [],
          additionalServiceCount: input.additionalServiceIds?.length || 0,
        });

        if (!VisaApplication) {
          throw new GraphQLError("데이터베이스 모델을 사용할 수 없습니다.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        const {
          personalInfo,
          travelInfo,
          applicationId,
          processingType,
          totalPrice,
          documents,
          additionalServiceIds,
        } = input;

        console.log("📝 Processing application data...");

        // Generate application number if not provided
        const applicationNumber = applicationId || `VN-${Date.now()}`; // Create the main visa application record with all data including personal and travel info
        const newApplication = await VisaApplication.create({
          applicationNumber: applicationNumber,
          visaType: travelInfo?.visaType || "E-visa",
          fullName: personalInfo
            ? `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim()
            : "",
          email: personalInfo?.email || null,
          phone: personalInfo?.phone || null,
          nationality: null, // Will be extracted from passport OCR if available
          birthDate: null, // Will be extracted from passport OCR if available
          passportNumber: null, // Will be extracted from passport OCR if available
          arrivalDate: travelInfo?.entryDate || null,
          departureDate: null, // Will be calculated based on visa type
          purpose: "Tourism", // Default purpose
          status: "pending",
          processingType: processingType || "standard",
          totalPrice: totalPrice || 0,
          applicationId: applicationNumber,
          // Personal info additional fields
          firstName: personalInfo?.firstName || null,
          lastName: personalInfo?.lastName || null,
          address: personalInfo?.address || null,
          phoneOfFriend: personalInfo?.phoneOfFriend || null,
          // Travel info additional fields
          entryPort: travelInfo?.entryPort || null,
          notes: `Created via web form. Processing: ${processingType}. Entry port: ${travelInfo?.entryPort || "N/A"}`,
          // TODO: Add userId when authentication is available
          userId: null,
        });

        console.log("✅ Application created with ID:", newApplication.id);

        // Process documents and save files
        const createdDocuments = [];
        if (documents && typeof documents === "object") {
          try {
            const { Document } = require("../../../models");
            if (Document) {
              for (const [docType, docData] of Object.entries(documents)) {
                if (docData && docData.fileName && docData.fileData) {
                  console.log(`📁 Processing document: ${docType}`);

                  // Validate file
                  if (!validateFileType(docData.fileName)) {
                    throw new GraphQLError(
                      `지원하지 않는 파일 형식입니다: ${docData.fileName}`,
                    );
                  }

                  if (!validateFileSize(docData.fileData)) {
                    throw new GraphQLError(
                      `파일 크기가 너무 큽니다: ${docData.fileName}`,
                    );
                  }

                  // Save file to disk
                  const savedFile = await saveBase64File(
                    docData.fileData,
                    docData.fileName,
                    applicationNumber,
                  ); // Prepare extracted info (OCR data) for database storage
                  let extractedInfoToStore = null;
                  if (docData.extractedInfo) {
                    console.log(
                      `🔍 Server received extractedInfo for ${docType}:`,
                      {
                        extractedInfo: docData.extractedInfo,
                        keys: Object.keys(docData.extractedInfo),
                        hasSnakeCase: Object.keys(docData.extractedInfo).some(
                          (key) => key.includes("_"),
                        ),
                        hasCamelCase: Object.keys(docData.extractedInfo).some(
                          (key) => /[A-Z]/.test(key),
                        ),
                      },
                    );

                    extractedInfoToStore = JSON.stringify(
                      docData.extractedInfo,
                    ); // Update main application with passport data if available
                    if (docType === "passport" && docData.extractedInfo) {
                      const ocrData = docData.extractedInfo;
                      await newApplication.update({
                        passport_number:
                          ocrData.passport_no || ocrData.passportNo || null,
                        nationality: ocrData.nationality || null,
                        birth_date:
                          ocrData.date_of_birth || ocrData.dateOfBirth
                            ? new Date(
                                ocrData.date_of_birth || ocrData.dateOfBirth,
                              )
                            : null,
                        full_name:
                          (ocrData.given_names || ocrData.givenNames) &&
                          ocrData.surname
                            ? `${ocrData.given_names || ocrData.givenNames} ${ocrData.surname}`
                            : newApplication.full_name,
                      });
                      console.log(
                        "📄 Updated application with passport OCR data",
                      );
                    }
                  }

                  // Create document record
                  const documentRecord = await Document.create({
                    applicationId: newApplication.id,
                    documentType: docType,
                    documentName: docData.fileName,
                    filePath: savedFile.filePath,
                    fileSize: savedFile.fileSize,
                    fileType: docData.fileType || "image/jpeg",
                    extractedInfo: extractedInfoToStore,
                    status: "pending",
                    uploadedAt: new Date(),
                  });

                  createdDocuments.push(documentRecord);
                  console.log(
                    `✅ Document created: ${docType} - ${savedFile.filePath}`,
                  );
                }
              }
            }
          } catch (docError) {
            console.error("❌ Document processing error:", docError);
            // Delete the application if document processing fails
            await newApplication.destroy();
            throw new GraphQLError(
              `문서 처리 중 오류가 발생했습니다: ${docError.message}`,
            );
          }
        } // TODO: Process additional services
        if (additionalServiceIds && additionalServiceIds.length > 0) {
          console.log(
            "📋 Additional services to process:",
            additionalServiceIds,
          );
          // Implementation will depend on AdditionalService model structure
          // For now, just log them
        }

        // Transform to GraphQL format using the created application data
        const result = {
          id: newApplication.id,
          applicationId: newApplication.applicationNumber,
          processingType: newApplication.processingType,
          totalPrice: newApplication.totalPrice,
          createdAt: newApplication.createdAt,
          personalInfo: {
            id: newApplication.id.toString(),
            firstName: newApplication.firstName || "",
            lastName: newApplication.lastName || "",
            email: newApplication.email || "",
            phone: newApplication.phone || "",
            address: newApplication.address || "",
            phoneOfFriend: newApplication.phoneOfFriend || "",
          },
          travelInfo: {
            id: newApplication.id.toString(),
            entryDate: newApplication.arrivalDate,
            entryPort: newApplication.entryPort || "",
            visaType: newApplication.visaType,
          },
          additionalServices: [], // TODO: Implement when AdditionalService model is ready
          documents: createdDocuments.map((doc) => ({
            id: doc.id,
            type: doc.documentType,
            fileName: doc.documentName,
            fileSize: doc.fileSize,
            fileType: doc.fileType,
            uploadedAt: doc.uploadedAt,
            extractedInfo: doc.extractedInfo
              ? JSON.parse(doc.extractedInfo)
              : null,
          })),
        };

        console.log(
          "🎉 Application creation successful:",
          result.applicationId,
        );
        console.log("📊 Created documents count:", createdDocuments.length);
        return result;
      } catch (error) {
        console.error("❌ createApplication error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        // 기타 인증 관련 에러들도 그대로 re-throw
        if (
          error.name === "TokenExpiredError" ||
          error.name === "JsonWebTokenError" ||
          error.name === "AuthenticationError" ||
          error.message === "Token has expired" ||
          error.message === "토큰이 만료되었습니다."
        ) {
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
    updateApplicationStatus: async (_, { id, status }, context) => {
      try {
        // 관리자 또는 스태프만 상태 변경 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("Updating application status:", { id, status });

        if (!VisaApplication) {
          console.log(
            "VisaApplication model not available, returning mock response",
          );
          return {
            id: id,
            status: status,
            updatedAt: new Date().toISOString(),
            applicationNumber: `VN-2024-${id.toString().padStart(3, "0")}`,
            fullName: "Mock Application",
          };
        }

        const application = await VisaApplication.findByPk(id);

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const previousStatus = application.status;

        // Use the new status conversion function
        const dbStatus = graphQLToDbStatus(status);
        console.log("Mapping status:", status, "->", dbStatus);

        // Update application status
        await application.update({ status: dbStatus });

        // Optionally create status history record if the model exists
        try {
          if (ApplicationStatusHistory) {
            await ApplicationStatusHistory.create({
              application_id: id,
              previous_status: previousStatus,
              new_status: dbStatus,
              changed_by: context?.user?.id || null,
              change_reason: "Manual status update",
            });
          }
        } catch (historyError) {
          console.log("Could not create status history:", historyError.message);
          // Continue without failing if history table doesn't exist
        }

        // Convert database status to GraphQL enum for return
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status),
        };

        return convertedApplication;
      } catch (error) {
        console.error("Status update error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("상태 업데이트에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    sendEmailToCustomer: async (
      _,
      { applicationId, emailType, content },
      context,
    ) => {
      try {
        // 관리자 또는 스태프만 이메일 발송 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("Sending email:", { applicationId, emailType });

        if (!VisaApplication) {
          return {
            success: false,
            message: "VisaApplication model not available",
          };
        }

        const application = await VisaApplication.findByPk(applicationId, {
          include: User ? [{ model: User, as: "applicant" }] : [],
        });

        if (!application) {
          return {
            success: false,
            message: "신청을 찾을 수 없습니다.",
          };
        }

        // For development/testing, we'll return success without actually sending email
        console.log("Email service - mock success");
        return {
          success: true,
          message: "이메일이 성공적으로 발송되었습니다. (개발 모드)",
        };
      } catch (error) {
        console.error("Email sending error:", error);
        return {
          success: false,
          message: "이메일 발송에 실패했습니다: " + error.message,
        };
      }
    },
    addApplicationMemo: async (_, { applicationId, content }, context) => {
      try {
        // 관리자 또는 스태프만 메모 추가 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("Adding memo:", { applicationId, content });

        // For now, we'll return a mock memo with proper structure
        const memo = {
          id: Date.now().toString(),
          content,
          created_at: new Date().toISOString(),
          created_by: user.name || "System",
        };

        console.log("Memo added (mock):", memo);
        return memo;
      } catch (error) {
        console.error("Add memo error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("메모 추가에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    updateApplicationInfo: async (_, { id, input }, context) => {
      try {
        // 관리자 또는 스태프만 신청 정보 수정 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("Updating application info:", { id, input });

        if (!VisaApplication) {
          console.log(
            "VisaApplication model not available, returning mock response",
          );
          return {
            id: id,
            ...input,
            updated_at: new Date().toISOString(),
          };
        }

        const application = await VisaApplication.findByPk(id);

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await application.update(input);

        // Convert database status to GraphQL enum for return
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status),
        };

        return convertedApplication;
      } catch (error) {
        console.error("Update application info error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("신청 정보 수정에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    downloadApplicationDocuments: async (_, { applicationId }, context) => {
      try {
        // 관리자 또는 스태프만 문서 다운로드 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        console.log("Downloading documents for application:", applicationId);

        if (!VisaApplication) {
          console.log(
            "VisaApplication model not available, returning mock response",
          );
          return {
            downloadUrl: `/api/download/application/${applicationId}/documents.zip`,
            fileName: `app_${applicationId}_documents.zip`,
          };
        }

        const application = await VisaApplication.findByPk(applicationId);

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // For now, return a mock response
        return {
          downloadUrl: `/api/download/application/${applicationId}/documents.zip`,
          fileName: `${application.applicationNumber || "app_" + applicationId}_documents.zip`,
        };
      } catch (error) {
        console.error("Download documents error:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("서류 다운로드 준비에 실패했습니다.", {
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
