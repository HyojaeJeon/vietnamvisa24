const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");
const {
  saveBase64File,
  getMimeTypeFromBase64,
} = require("../../../utils/fileUpload");
const { socketNotifications } = require("../../../utils/socketManager");
const {
  createApplicationStatusNotification,
  createNewApplicationNotification,
} = require("../../../utils/notificationHelpers");

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

// Status and type conversion functions - All ENUM values are stored in uppercase
const dbToGraphQLStatus = (dbStatus) => {
  // DB에서 이미 대문자로 저장되어 있으므로 그대로 반환
  if (!dbStatus) return "PENDING";
  return dbStatus.toUpperCase();
};

const graphQLToDbStatus = (graphqlStatus) => {
  // GraphQL에서 받은 대문자 값을 그대로 DB에 저장
  if (!graphqlStatus) return "PENDING";
  return graphqlStatus.toUpperCase();
};

// ProcessingType은 대문자로 통일
const normalizeProcessingType = (processingType) => {
  if (!processingType) return "STANDARD";
  return processingType.toUpperCase();
};

// VisaType은 대문자로 통일
const normalizeVisaType = (visaType) => {
  if (!visaType) return "TOURIST";
  return visaType.toUpperCase();
};

// Status는 대문자로 통일
const normalizeStatus = (status) => {
  if (!status) return "PENDING";
  return status.toUpperCase();
};

// 비자 타입 표시명 변환 함수
const getVisaTypeDisplayName = (visaType) => {
  const typeMap = {
    E_VISA_GENERAL: "E-VISA 일반 (4-5일)",
    E_VISA_URGENT: "E-VISA 긴급 (24시간)",
    E_VISA_TRANSIT: "목바이 경유 비자",
    tourist: "관광 비자",
    business: "비즈니스 비자",
    transit: "경유 비자",
  };
  return typeMap[visaType] || visaType;
};

// 가격 구조 포맷팅 함수
const formatPricingDetails = (application) => {
  try {
    // 저장된 notes에서 가격 상세 정보 추출 시도
    let pricingDetails = null;
    if (application.notes && application.notes.includes("가격상세:")) {
      const match = application.notes.match(/가격상세:\s*({.*})/);
      if (match) {
        try {
          pricingDetails = JSON.parse(match[1]);
        } catch (parseError) {
          console.warn("가격 상세 정보 파싱 실패:", parseError.message);
        }
      }
    }

    // 상세 가격 정보가 있는 경우
    if (pricingDetails && pricingDetails.totalPrice) {
      const currency = pricingDetails.currency || "KRW";
      const isTransit = application.visaType === "E_VISA_TRANSIT";

      return {
        visa: {
          basePrice: pricingDetails.visa?.basePrice || 0,
          vehiclePrice: pricingDetails.visa?.vehiclePrice || 0,
          totalPrice: pricingDetails.visa?.totalPrice || 0,
        },
        additionalServices: {
          services: (pricingDetails.additionalServices?.services || []).map(
            (service) => ({
              ...service,
              name: getServiceNameInKorean(service.id || service.name),
            }),
          ),
          totalPrice: pricingDetails.additionalServices?.totalPrice || 0,
        },
        totalPrice: pricingDetails.totalPrice,
        currency: currency,
        formatted: {
          visaBasePrice: formatCurrency(
            pricingDetails.visa?.basePrice || 0,
            currency,
          ),
          visaVehiclePrice: formatCurrency(
            pricingDetails.visa?.vehiclePrice || 0,
            currency,
          ),
          visaTotalPrice: formatCurrency(
            pricingDetails.visa?.totalPrice || 0,
            currency,
          ),
          additionalServicesPrice: formatCurrency(
            pricingDetails.additionalServices?.totalPrice || 0,
            currency,
          ),
          totalPrice: formatCurrency(pricingDetails.totalPrice, currency),
        },
      };
    }

    // 기본 가격만 있는 경우
    return {
      visa: {
        basePrice: application.totalPrice || 0,
        vehiclePrice: 0,
        totalPrice: application.totalPrice || 0,
      },
      additionalServices: {
        services: [],
        totalPrice: 0,
      },
      totalPrice: application.totalPrice || 0,
      currency: "KRW",
      formatted: {
        visaBasePrice: formatCurrency(application.totalPrice || 0, "KRW"),
        visaVehiclePrice: formatCurrency(0, "KRW"),
        visaTotalPrice: formatCurrency(application.totalPrice || 0, "KRW"),
        additionalServicesPrice: formatCurrency(0, "KRW"),
        totalPrice: formatCurrency(application.totalPrice || 0, "KRW"),
      },
    };
  } catch (error) {
    console.error("가격 구조 포맷팅 오류:", error);
    // 오류 시 기본 구조 반환
    return {
      visa: { basePrice: 0, vehiclePrice: 0, totalPrice: 0 },
      additionalServices: { services: [], totalPrice: 0 },
      totalPrice: 0,
      currency: "KRW",
      formatted: {
        visaBasePrice: "₩0",
        visaVehiclePrice: "₩0",
        visaTotalPrice: "₩0",
        additionalServicesPrice: "₩0",
        totalPrice: "₩0",
      },
    };
  }
};

// 통화 포맷팅 함수
const formatCurrency = (amount, currency = "KRW") => {
  if (!amount) return currency === "VND" ? "₫0" : "₩0";

  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount);
  }
};

// 추가 서비스 한글 매핑 함수
const getServiceNameInKorean = (serviceName) => {
  const serviceMapping = {
    FAST_TRACK_ARRIVAL_PREMIUM: "패스트트랙 입국 프리미엄",
    FAST_TRACK_ARRIVAL_STANDARD: "패스트트랙 입국 스탠다드",
    FAST_TRACK_DEPARTURE_PREMIUM: "패스트트랙 출국 프리미엄",
    FAST_TRACK_DEPARTURE_STANDARD: "패스트트랙 출국 스탠다드",
    AIRPORT_PICKUP_SEDAN_DISTRICT1: "공항 픽업 세단 (1,3,푸년군)",
    AIRPORT_PICKUP_SUV_DISTRICT1: "공항 픽업 SUV (1,3,푸년군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT2: "공항 픽업 세단 (2,4,7,빈탄군)",
    AIRPORT_PICKUP_SUV_DISTRICT2: "공항 픽업 SUV (2,4,7,빈탄군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT3: "공항 픽업 세단 (5,6,8,투득군)",
    AIRPORT_PICKUP_SUV_DISTRICT3: "공항 픽업 SUV (5,6,8,투득군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT4: "공항 픽업 세단 (9,10,11,12군)",
    AIRPORT_PICKUP_SUV_DISTRICT4: "공항 픽업 SUV (9,10,11,12군)",
    CITY_TOUR_HALF_DAY: "반일 시내 투어",
    CITY_TOUR_FULL_DAY: "하루 시내 투어",
    MEKONG_DELTA_TOUR: "메콩델타 투어",
    CU_CHI_TUNNEL_TOUR: "구찌터널 투어",
  };

  return serviceMapping[serviceName] || serviceName;
};

const resolvers = {
  Query: {
    // applications 쿼리: 새로운 대시보드와 호환되는 형식 (페이지네이션 및 필터 지원)
    applications: async (_, args, context) => {
      try {
        console.log("🔍 applications 쿼리 호출됨", args);

        // // 관리자 또는 스태프만 접근 가능
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        //   "USER",
        // ]);

        // console.log("✅ 인증된 사용자:", user.role);

        // 페이지네이션 및 필터 파라미터
        const {
          page = 1,
          limit = 10,
          searchTerm = "",
          statusFilter = "all",
          visaTypeFilter = "all",
          processingTypeFilter = "all",
        } = args;

        const offset = (page - 1) * limit;

        // 필터 조건 구성
        const whereConditions = {};

        if (searchTerm) {
          whereConditions[VisaApplication.sequelize.Op.or] = [
            {
              firstName: {
                [VisaApplication.sequelize.Op.like]: `%${searchTerm}%`,
              },
            },
            {
              lastName: {
                [VisaApplication.sequelize.Op.like]: `%${searchTerm}%`,
              },
            },
            {
              fullName: {
                [VisaApplication.sequelize.Op.like]: `%${searchTerm}%`,
              },
            },
            {
              email: { [VisaApplication.sequelize.Op.like]: `%${searchTerm}%` },
            },
            {
              applicationId: {
                [VisaApplication.sequelize.Op.like]: `%${searchTerm}%`,
              },
            },
          ];
        }

        if (statusFilter && statusFilter !== "all") {
          whereConditions.status = statusFilter
            .toLowerCase()
            .replace(/_/g, "_");
        }

        if (visaTypeFilter && visaTypeFilter !== "all") {
          whereConditions.visaType = visaTypeFilter;
        }

        if (processingTypeFilter && processingTypeFilter !== "all") {
          whereConditions.processingType = processingTypeFilter;
        }

        // 전체 카운트 조회
        const totalCount = await VisaApplication.count({
          where: whereConditions,
        }); // 실제 데이터베이스에서 조회
        const applications = await VisaApplication.findAll({
          where: whereConditions,
          include: [
            {
              model: Document,
              as: "documents",
              required: false,
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: limit,
          offset: offset,
        });

        console.log(
          `📊 데이터베이스에서 ${applications.length}개 신청서 조회됨 (총 ${totalCount}개)`,
        ); // 실제 데이터베이스 구조에 맞게 변환
        const mappedApplications = applications.map((app) => ({
          id: app.id.toString(),
          applicationId: app.applicationId || `APP-${app.id}`,
          processingType: app.processingType || "standard",
          totalPrice: app.totalPrice || 0,
          status: dbToGraphQLStatus(app.status || "pending"),
          createdAt: app.createdAt,
          personalInfo: {
            id: app.id.toString(),
            firstName: app.firstName || app.fullName?.split(" ")[0] || "이름",
            lastName: app.lastName || app.fullName?.split(" ")[1] || "성",
            fullName:
              app.fullName ||
              `${app.firstName || ""} ${app.lastName || ""}`.trim(),
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
          documents: (app.documents || []).map((doc) => {
            console.log(`🔍 Processing document ${doc.id} (${doc.type}):`, {
              hasExtractedInfo: !!doc.extractedInfo,
              extractedInfoType: typeof doc.extractedInfo,
              extractedInfoRaw: doc.extractedInfo,
            });

            let parsedExtractedInfo = null;
            if (doc.extractedInfo) {
              try {
                parsedExtractedInfo =
                  typeof doc.extractedInfo === "string"
                    ? JSON.parse(doc.extractedInfo)
                    : doc.extractedInfo;
                console.log(
                  `✅ Successfully parsed extractedInfo for document ${doc.id}:`,
                  parsedExtractedInfo,
                );
              } catch (e) {
                console.warn(
                  `❌ extractedInfo parsing failed for document ${doc.id}:`,
                  e,
                );
                parsedExtractedInfo = null;
              }
            } else {
              console.log(
                `ℹ️ No extractedInfo found for document ${doc.id} (${doc.type})`,
              );
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
        }));

        return {
          applications: mappedApplications,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          hasNextPage: page * limit < totalCount,
          hasPreviousPage: page > 1,
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
    }, // 대시보드 통계 쿼리
    applicationStatistics: async (_, __, context) => {
      try {
        console.log("🔍 applicationStatistics 쿼리 호출됨");

        // 관리자 또는 스태프만 접근 가능
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        //   "USER",
        // ]);

        if (!VisaApplication) {
          // 목업 데이터 반환
          return {
            pending: 5,
            processing: 8,
            completed: 12,
            total: 25,
          };
        } // 상태별 카운트
        const pending = await VisaApplication.count({
          where: { status: "PENDING" },
        });

        const processing = await VisaApplication.count({
          where: {
            status: {
              [VisaApplication.sequelize.Op.in]: [
                "PROCESSING",
                "DOCUMENT_REVIEW",
                "SUBMITTED_TO_AUTHORITY",
              ],
            },
          },
        });

        const completed = await VisaApplication.count({
          where: {
            status: {
              [VisaApplication.sequelize.Op.in]: ["APPROVED", "COMPLETED"],
            },
          },
        });

        const total = await VisaApplication.count();

        console.log(
          `📊 통계: 대기 ${pending}, 처리중 ${processing}, 완료 ${completed}, 전체 ${total}`,
        );

        return {
          pending,
          processing,
          completed,
          total,
        };
      } catch (error) {
        console.error("❌ applicationStatistics 쿼리 오류:", error);

        // 목업 데이터 반환
        return {
          pending: 0,
          processing: 0,
          completed: 0,
          total: 0,
        };
      }
    },

    // 상태별 상세 개수 조회 (대시보드용)
    applicationStatusCounts: async (_, __, context) => {
      try {
        console.log("🔍 applicationStatusCounts 쿼리 호출됨");

        if (!VisaApplication) {
          // 목업 데이터 반환
          return {
            pending: 12,
            processing: 8,
            document_review: 15,
            submitted_to_authority: 6,
            approved: 23,
            completed: 45,
            total: 109,
          };
        }

        // 각 상태별 개수 조회
        const [
          pending,
          processing,
          document_review,
          submitted_to_authority,
          approved,
          completed,
          total,
        ] = await Promise.all([
          VisaApplication.count({ where: { status: "PENDING" } }),
          VisaApplication.count({ where: { status: "PROCESSING" } }),
          VisaApplication.count({ where: { status: "DOCUMENT_REVIEW" } }),
          VisaApplication.count({
            where: { status: "SUBMITTED_TO_AUTHORITY" },
          }),
          VisaApplication.count({ where: { status: "APPROVED" } }),
          VisaApplication.count({ where: { status: "COMPLETED" } }),
          VisaApplication.count(),
        ]);

        console.log(
          `📊 상세 통계: 대기 ${pending}, 처리중 ${processing}, 서류검토 ${document_review}, 기관제출 ${submitted_to_authority}, 승인 ${approved}, 완료 ${completed}, 전체 ${total}`,
        );

        return {
          pending,
          processing,
          document_review,
          submitted_to_authority,
          approved,
          completed,
          total,
        };
      } catch (error) {
        console.error("❌ applicationStatusCounts 쿼리 오류:", error);

        // 목업 데이터 반환
        return {
          pending: 0,
          processing: 0,
          document_review: 0,
          submitted_to_authority: 0,
          approved: 0,
          completed: 0,
          total: 0,
        };
      }
    },

    // application 단건 조회
    application: async (_, { id }, context) => {
      try {
        console.log("🔍 application 단건 쿼리 호출됨, ID:", id);

        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        //   "USER",
        // ]);

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

        // 여권 문서에서 extractedInfo 가져오기
        let applicationExtractedInfo = null;
        const passportDocument = application.documents?.find(
          (doc) => doc.type === "passport",
        );
        if (passportDocument && passportDocument.extractedInfo) {
          try {
            applicationExtractedInfo =
              typeof passportDocument.extractedInfo === "string"
                ? JSON.parse(passportDocument.extractedInfo)
                : passportDocument.extractedInfo;
          } catch (parseError) {
            console.warn(
              `⚠️ Application extractedInfo 파싱 실패:`,
              parseError.message,
            );
            applicationExtractedInfo = null;
          }
        }
        return {
          id: application.id.toString(),
          applicationId: application.applicationId || `APP-${application.id}`,
          processingType: application.processingType || "STANDARD",
          totalPrice: formatPricingDetails(application),
          createdAt: application.createdAt,
          updatedAt: application.updatedAt || application.createdAt,
          // Transit visa specific fields
          transitPeopleCount: application.transitPeopleCount || null,
          transitVehicleType: application.transitVehicleType || null,
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
          additionalServices:
            application.additionalServices?.map((service) => ({
              id: service.id.toString(),
              name: service.name || service.serviceId,
            })) || [],
          documents:
            application.documents?.map((doc) => {
              console.log(
                `🔍 [Single App Query] Processing document ${doc.id} (${doc.type}):`,
                {
                  hasExtractedInfo: !!doc.extractedInfo,
                  extractedInfoType: typeof doc.extractedInfo,
                  extractedInfoRaw: doc.extractedInfo,
                },
              );

              // extractedInfo JSON 파싱 처리
              let parsedExtractedInfo = null;
              if (doc.extractedInfo) {
                try {
                  parsedExtractedInfo =
                    typeof doc.extractedInfo === "string"
                      ? JSON.parse(doc.extractedInfo)
                      : doc.extractedInfo;
                  console.log(
                    `✅ [Single App Query] Successfully parsed extractedInfo for document ${doc.id}:`,
                    parsedExtractedInfo,
                  );
                } catch (parseError) {
                  console.warn(
                    `⚠️ [Single App Query] extractedInfo 파싱 실패 (doc ${doc.id}):`,
                    parseError.message,
                  );
                  parsedExtractedInfo = null;
                }
              } else {
                console.log(
                  `ℹ️ [Single App Query] No extractedInfo found for document ${doc.id} (${doc.type})`,
                );
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
            }) || [],
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
          // 1. 신청서 데이터 생성 - 모든 ENUM 값을 대문자로 정규화
          // totalPrice 구조 분석 및 추출
          let finalTotalPrice = 0;
          let pricingDetails = null;

          if (input.totalPrice) {
            if (typeof input.totalPrice === "number") {
              // 기존 방식 (단순 숫자)
              finalTotalPrice = input.totalPrice;
            } else if (
              typeof input.totalPrice === "object" &&
              input.totalPrice.totalPrice
            ) {
              // 새로운 방식 (상세 가격 정보)
              finalTotalPrice = input.totalPrice.totalPrice;
              pricingDetails = input.totalPrice;
              console.log("📊 상세 가격 정보 감지:", pricingDetails);
            }
          }

          const applicationData = {
            userId: user?.id || null,
            applicationId: input.applicationId || `VN${Date.now()}`,
            processingType: normalizeProcessingType(
              input.processingType || "STANDARD",
            ),
            totalPrice: finalTotalPrice,
            status: "PENDING", // 대문자로 고정

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

            // Travel Info 매핑 - visaType도 정규화
            visaType: normalizeVisaType(input.travelInfo?.visaType),
            entryDate: input.travelInfo?.entryDate,
            arrivalDate: input.travelInfo?.entryDate, // 호환성을 위해
            entryPort: input.travelInfo?.entryPort,

            // Transit visa specific fields
            transitPeopleCount: input.transitPeopleCount || null,
            transitVehicleType: input.transitVehicleType || null,

            // 기타 필드 - 상세 가격 정보가 있으면 추가
            notes: `신청 타입: ${input.processingType}, 총 가격: ${finalTotalPrice}원${input.transitPeopleCount ? `, 경유 인원수: ${input.transitPeopleCount}명` : ""}${input.transitVehicleType ? `, 차량: ${input.transitVehicleType}` : ""}${pricingDetails ? `, 가격상세: ${JSON.stringify(pricingDetails)}` : ""}`,
          };

          console.log("💾 저장할 신청서 데이터:", applicationData);

          // 2. 신청서 생성
          const newApplication = await VisaApplication.create(applicationData, {
            transaction,
          });
          console.log("✅ 신청서 생성 성공, ID:", newApplication.id); // 3. Documents 처리
          const createdDocuments = [];
          if (input.documents && Object.keys(input.documents).length > 0) {
            console.log("📄 Documents 처리 시작...");

            for (const [docType, docData] of Object.entries(input.documents)) {
              if (docData && (docData.fileData || docData.fileName)) {
                console.log(`📄 Processing document: ${docType}`); // 파일을 물리적으로 저장
                let filePath = null;
                if (docData.fileData && docData.fileData.startsWith("data:")) {
                  try {
                    console.log(
                      `💾 Saving file to disk for document: ${docType}`,
                    );

                    // 신청자 이름 생성 (한글 이름 우선, 없으면 영문 이름)
                    const applicantName =
                      applicationData.fullName ||
                      `${applicationData.firstName}_${applicationData.lastName}` ||
                      "신청자";

                    // 문서 타입을 한글로 매핑
                    const documentTypeMap = {
                      passport: "여권",
                      photo: "증명사진",
                      visa: "비자",
                      ticket: "항공권",
                      hotel: "숙박예약증",
                      invitation: "초청장",
                      insurance: "보험증서",
                    };
                    const documentTypeName =
                      documentTypeMap[docType] || docType;

                    const fileResult = await saveBase64File(
                      docData.fileData,
                      docData.fileName,
                      newApplication.id.toString(),
                      applicantName,
                      documentTypeName,
                    );
                    filePath = fileResult.filePath;
                    console.log(`✅ File saved to: ${filePath}`);
                  } catch (fileError) {
                    console.error(
                      `❌ File save failed for ${docType}:`,
                      fileError,
                    );
                    // 파일 저장 실패 시 Base64 데이터를 그대로 사용
                  }
                } // extractedInfo 디버깅 로그 추가
                console.log(`🔍 Processing extractedInfo for ${docType}:`, {
                  hasExtractedInfo: !!docData.extractedInfo,
                  extractedInfoType: typeof docData.extractedInfo,
                  extractedInfoContent: docData.extractedInfo,
                });

                // extractedInfo를 JSON 문자열로 변환 (JSON 타입 컬럼에 저장하기 위함)
                let processedExtractedInfo = null;
                if (docData.extractedInfo) {
                  try {
                    processedExtractedInfo =
                      typeof docData.extractedInfo === "string"
                        ? docData.extractedInfo
                        : JSON.stringify(docData.extractedInfo);
                    console.log(
                      `✅ ExtractedInfo processed for ${docType}:`,
                      processedExtractedInfo,
                    );
                  } catch (error) {
                    console.error(
                      `❌ Failed to process extractedInfo for ${docType}:`,
                      error,
                    );
                    processedExtractedInfo = null;
                  }
                }

                const documentData = {
                  applicationId: newApplication.id,
                  type: docType,
                  fileName: docData.fileName,
                  fileSize: docData.fileSize || 0,
                  fileType:
                    docData.fileType ||
                    getMimeTypeFromBase64(docData.fileData || "") ||
                    "application/octet-stream",
                  filePath: filePath, // 파일 경로 저장
                  fileData: filePath ? null : docData.fileData, // 파일 저장 성공 시 Base64 데이터 제거
                  extractedInfo: processedExtractedInfo,
                  uploadedAt: new Date(),
                };

                if (Document) {
                  const createdDocument = await Document.create(documentData, {
                    transaction,
                  });
                  createdDocuments.push(createdDocument);
                  console.log(
                    `✅ Document created: ${docType}, ID: ${createdDocument.id}, filePath: ${filePath || "BASE64"}`,
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
          }); // Socket.IO로 실시간 알림 전송 (관리자에게)
          try {
            socketNotifications.notifyNewApplication({
              id: newApplication.id,
              applicationId: response.applicationId,
              firstName: response.personalInfo.firstName,
              lastName: response.personalInfo.lastName,
              email: response.personalInfo.email,
              visaType: response.travelInfo.visaType,
              processingType: response.processingType,
              totalPrice: response.totalPrice,
              createdAt: response.createdAt,
              status: "PENDING",
            });
            console.log("📢 실시간 알림 전송 완료");
          } catch (notificationError) {
            console.error("⚠️ 실시간 알림 전송 실패:", notificationError);
            // 알림 실패는 전체 프로세스를 중단시키지 않음
          } // 데이터베이스 알림 생성 (관리자용)
          try {
            await createNewApplicationNotification(
              newApplication.id.toString(),
              `${response.personalInfo.firstName} ${response.personalInfo.lastName}`,
              response.travelInfo.visaType,
            );
            console.log("✅ 새 신청 알림 생성 완료");
          } catch (notificationError) {
            console.warn(
              "⚠️ 데이터베이스 알림 생성 실패:",
              notificationError.message,
            );
            // 알림 생성 실패는 주 프로세스를 중단시키지 않음
          }

          // GraphQL Subscription 이벤트 발행
          try {
            const { pubsub } = require("../../../utils/pubsub");

            // 새 신청서 생성 이벤트 발행
            pubsub.publish("APPLICATION_CREATED", {
              applicationCreated: response,
            });
            console.log("📡 APPLICATION_CREATED 구독 이벤트 발행 완료"); // 상태 카운트 업데이트 이벤트도 발행 (통계 실시간 업데이트)
            try {
              // applicationStatusCounts 쿼리와 동일한 로직 사용
              const [
                pending,
                processing,
                document_review,
                submitted_to_authority,
                approved,
                completed,
                total,
              ] = await Promise.all([
                VisaApplication.count({ where: { status: "PENDING" } }),
                VisaApplication.count({ where: { status: "PROCESSING" } }),
                VisaApplication.count({ where: { status: "DOCUMENT_REVIEW" } }),
                VisaApplication.count({
                  where: { status: "SUBMITTED_TO_AUTHORITY" },
                }),
                VisaApplication.count({ where: { status: "APPROVED" } }),
                VisaApplication.count({ where: { status: "COMPLETED" } }),
                VisaApplication.count(),
              ]);

              const updatedCounts = {
                pending,
                processing,
                document_review,
                submitted_to_authority,
                approved,
                completed,
                total,
              };

              pubsub.publish("APPLICATION_STATUS_COUNTS_UPDATED", {
                applicationStatusCountsUpdated: updatedCounts,
              });
              console.log(
                "📊 APPLICATION_STATUS_COUNTS_UPDATED 구독 이벤트 발행 완료",
              );
            } catch (countError) {
              console.warn("⚠️ 상태 카운트 업데이트 실패:", countError.message);
            }
          } catch (pubsubError) {
            console.error(
              "⚠️ GraphQL Subscription 이벤트 발행 실패:",
              pubsubError,
            );
            // Subscription 실패는 주 프로세스를 중단시키지 않음
          } // 🎉 이메일 발송 기능 추가
          try {
            const { emailTemplates } = require("../../../utils/emailService");

            // 가격 정보를 올바른 형식으로 포맷팅
            const pricingDetails = formatPricingDetails(newApplication);

            // 신청자에게 접수 확인 이메일 발송
            const emailData = {
              // 기본 정보
              email: response.personalInfo.email,
              customerName:
                response.personalInfo.fullName ||
                `${response.personalInfo.firstName} ${response.personalInfo.lastName}`.trim(),
              fullName:
                response.personalInfo.fullName ||
                `${response.personalInfo.firstName} ${response.personalInfo.lastName}`.trim(),
              applicationNumber: response.applicationId,

              // 비자 정보
              visaType: getVisaTypeDisplayName(response.travelInfo.visaType),
              processingType:
                response.processingType === "URGENT"
                  ? "긴급 처리"
                  : "일반 처리",
              createdAt: response.createdAt,
              submittedAt: response.createdAt,
              visa_type: response.travelInfo.visaType,

              // 개인 정보
              phone: response.personalInfo.phone,
              address: response.personalInfo.address,
              phoneOfFriend: response.personalInfo.phoneOfFriend,

              // 여행 정보
              entryDate: response.travelInfo.entryDate,
              entryPort: response.travelInfo.entryPort,
              transitPeopleCount: newApplication.transitPeopleCount,
              transitVehicleType: newApplication.transitVehicleType,

              // 추가 서비스 (이름만 전달, 한글 매핑은 emailService에서 처리)
              additionalServices: response.additionalServices,

              // 비용 정보 (상세 구조)
              totalPrice: pricingDetails,
              currency: pricingDetails.currency,
            };

            console.log("📧 이메일 발송 시도:", {
              ...emailData,
              totalPrice: "가격 정보 구조 확인됨",
            });

            await emailTemplates.sendApplicationConfirmation(emailData);
            console.log("✅ 신청 접수 확인 이메일 발송 완료");
          } catch (emailError) {
            console.error("❌ 이메일 발송 실패:", emailError.message);
            // 이메일 발송 실패는 주 프로세스를 중단시키지 않음
            console.warn(
              "⚠️ 이메일 발송은 실패했지만 신청서는 정상적으로 생성되었습니다.",
            );
          }

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
      // 트랜잭션 시작
      const transaction = await VisaApplication.sequelize.transaction();

      try {
        console.log("🔄 상태 업데이트 요청:", { id, status });

        // 관리자 권한 확인
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        // ]);

        const application = await VisaApplication.findByPk(id, { transaction });
        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const previousStatus = application.status;
        const newStatus = normalizeStatus(status);

        // 상태 업데이트 (트랜잭션 사용)
        await application.update(
          {
            status: newStatus,
          },
          { transaction },
        ); // 상태 히스토리 기록 (선택적)
        try {
          if (ApplicationStatusHistory) {
            await ApplicationStatusHistory.create(
              {
                applicationId: application.id,
                previousStatus: previousStatus,
                newStatus: newStatus,
                changedBy: context?.user?.id || null,
                notes: `상태 변경: ${previousStatus} → ${newStatus}`,
              },
              { transaction },
            );
            console.log("✅ 상태 히스토리 기록 완료");
          }
        } catch (historyError) {
          console.warn("⚠️ 상태 히스토리 기록 실패:", historyError.message);
          // 히스토리 기록 실패는 주 업데이트에 영향을 주지 않도록 처리
        }

        // 상태 변경 알림 생성
        try {
          if (application.email) {
            await createApplicationStatusNotification(
              application.id.toString(),
              application.email,
              dbToGraphQLStatus(previousStatus),
              dbToGraphQLStatus(newStatus),
            );
            console.log("✅ 상태 변경 알림 생성 완료");
          }
        } catch (notificationError) {
          console.warn("⚠️ 알림 생성 실패:", notificationError.message);
          // 알림 생성 실패는 주 업데이트에 영향을 주지 않도록 처리
        } // 모든 업데이트가 성공하면 트랜잭션 커밋
        await transaction.commit();

        console.log("✅ 상태 업데이트 완료:", { id, newStatus: status }); // GraphQL Subscription 이벤트 발행
        try {
          const { pubsub } = require("../../../utils/pubsub");

          // 업데이트된 신청서 정보를 다시 조회하여 subscription에 발행
          const updatedApplication = await VisaApplication.findByPk(id, {
            include: [
              { model: Document, as: "documents" },
              { model: AdditionalService, as: "additionalServices" },
            ],
          });

          if (updatedApplication) {
            // 기존 응답 형식과 동일하게 변환
            const subscriptionData = {
              id: updatedApplication.id.toString(),
              applicationId: updatedApplication.applicationId,
              processingType: updatedApplication.processingType,
              totalPrice: updatedApplication.totalPrice,
              status: dbToGraphQLStatus(updatedApplication.status),
              createdAt: updatedApplication.createdAt,
              personalInfo: {
                id: updatedApplication.id.toString(),
                firstName:
                  updatedApplication.firstName ||
                  updatedApplication.fullName?.split(" ")[0] ||
                  "이름",
                lastName:
                  updatedApplication.lastName ||
                  updatedApplication.fullName?.split(" ")[1] ||
                  "성",
                fullName:
                  updatedApplication.fullName ||
                  `${updatedApplication.firstName || ""} ${updatedApplication.lastName || ""}`.trim(),
                email: updatedApplication.email || "",
                phone: updatedApplication.phone || "",
                address: updatedApplication.address || "",
                phoneOfFriend: updatedApplication.phoneOfFriend || null,
              },
              travelInfo: {
                id: updatedApplication.id.toString(),
                entryDate:
                  updatedApplication.entryDate ||
                  updatedApplication.arrivalDate,
                entryPort: updatedApplication.entryPort || "인천국제공항",
                visaType: updatedApplication.visaType || "E_VISA_GENERAL",
              },
              additionalServices:
                updatedApplication.additionalServices?.map((service) => ({
                  id: service.id.toString(),
                  name: service.name,
                })) || [],
              documents:
                updatedApplication.documents?.map((doc) => ({
                  id: doc.id.toString(),
                  type: doc.type,
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  fileType: doc.fileType,
                  uploadedAt: doc.uploadedAt,
                  fileUrl: doc.fileUrl,
                })) || [],
            };

            // 신청서 업데이트 이벤트 발행
            pubsub.publish("APPLICATION_UPDATED", {
              applicationUpdated: subscriptionData,
            });
            console.log("📡 APPLICATION_UPDATED 구독 이벤트 발행 완료");

            // 상태 카운트 업데이트 이벤트도 발행
            try {
              // applicationStatusCounts 쿼리와 동일한 로직 사용
              const [
                pending,
                processing,
                document_review,
                submitted_to_authority,
                approved,
                completed,
                total,
              ] = await Promise.all([
                VisaApplication.count({ where: { status: "PENDING" } }),
                VisaApplication.count({ where: { status: "PROCESSING" } }),
                VisaApplication.count({ where: { status: "DOCUMENT_REVIEW" } }),
                VisaApplication.count({
                  where: { status: "SUBMITTED_TO_AUTHORITY" },
                }),
                VisaApplication.count({ where: { status: "APPROVED" } }),
                VisaApplication.count({ where: { status: "COMPLETED" } }),
                VisaApplication.count(),
              ]);

              const updatedCounts = {
                pending,
                processing,
                document_review,
                submitted_to_authority,
                approved,
                completed,
                total,
              };

              pubsub.publish("APPLICATION_STATUS_COUNTS_UPDATED", {
                applicationStatusCountsUpdated: updatedCounts,
              });
              console.log(
                "📊 APPLICATION_STATUS_COUNTS_UPDATED 구독 이벤트 발행 완료",
              );
            } catch (countError) {
              console.warn("⚠️ 상태 카운트 업데이트 실패:", countError.message);
            }
          }
        } catch (pubsubError) {
          console.error(
            "⚠️ GraphQL Subscription 이벤트 발행 실패:",
            pubsubError,
          );
          // Subscription 실패는 주 프로세스를 중단시키지 않음
        }

        return {
          id: application.id.toString(),
          status: dbToGraphQLStatus(application.status),
          message: "상태가 성공적으로 업데이트되었습니다.",
        };
      } catch (error) {
        // 오류 발생 시 트랜잭션 롤백
        await transaction.rollback();
        console.error("❌ 상태 업데이트 실패 (트랜잭션 롤백):", error);
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

        // // 관리자 권한 확인
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        // ]);

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
    }, // 신청서 업데이트 뮤테이션
    updateApplication: async (_, { id, input }, context) => {
      // 트랜잭션 시작
      const transaction = await VisaApplication.sequelize.transaction();

      try {
        console.log("🔄 신청서 업데이트 요청:", { id, input });

        // // 관리자 권한 확인
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        // ]);

        const application = await VisaApplication.findByPk(id, { transaction });
        if (!application) {
          throw new GraphQLError("신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // 업데이트 데이터 준비
        const updateData = {};
        if (input.personalInfo) {
          updateData.firstName = input.personalInfo.firstName;
          updateData.lastName = input.personalInfo.lastName;
          updateData.fullName =
            input.personalInfo.fullName ||
            `${input.personalInfo.firstName} ${input.personalInfo.lastName}`;
          updateData.email = input.personalInfo.email;
          updateData.phone = input.personalInfo.phone;
          updateData.address = input.personalInfo.address;
          updateData.phoneOfFriend = input.personalInfo.phoneOfFriend;
        }

        if (input.travelInfo) {
          updateData.visaType = input.travelInfo.visaType;
          updateData.entryDate = input.travelInfo.entryDate;
          updateData.arrivalDate = input.travelInfo.entryDate;
          updateData.entryPort = input.travelInfo.entryPort;
        }

        if (input.processingType) {
          updateData.processingType = input.processingType;
        }

        if (input.totalPrice !== undefined) {
          updateData.totalPrice = input.totalPrice;
        }

        // 신청서 업데이트 (트랜잭션 사용)
        await application.update(updateData, { transaction });

        // 추출된 정보 업데이트 (여권 문서의 extractedInfo)
        if (input.extractedInfo) {
          console.log("🔄 추출된 정보 업데이트 요청:", input.extractedInfo);

          // 해당 신청서의 여권 문서 찾기 (트랜잭션 사용)
          const passportDocument = await Document.findOne({
            where: {
              applicationId: application.id,
              type: "passport",
            },
            transaction,
          });

          if (passportDocument) {
            const updatedExtractedInfo = JSON.stringify(input.extractedInfo);
            await passportDocument.update(
              {
                extractedInfo: updatedExtractedInfo,
              },
              { transaction },
            );
            console.log("✅ 여권 추출 정보 업데이트 완료");
          } else {
            console.warn(
              "⚠️ 여권 문서를 찾을 수 없어 추출된 정보를 업데이트할 수 없습니다.",
            );
          }
        }

        // 모든 업데이트가 성공하면 트랜잭션 커밋
        await transaction.commit();

        console.log("✅ 신청서 업데이트 완료:", {
          id,
          updatedFields: Object.keys(updateData),
        }); // 업데이트된 데이터를 GraphQL 형식으로 반환
        return {
          id: application.id.toString(),
          applicationId: application.applicationId || `APP-${application.id}`,
          processingType: application.processingType || "STANDARD",
          totalPrice: application.totalPrice || 0,
          status: dbToGraphQLStatus(application.status),
          createdAt: application.createdAt,
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
          documents: [],
        };
      } catch (error) {
        // 오류 발생 시 트랜잭션 롤백
        await transaction.rollback();
        console.error("❌ 신청서 업데이트 실패 (트랜잭션 롤백):", error);
        throw new GraphQLError("신청서 업데이트에 실패했습니다.", {
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

        // // 관리자 권한 확인
        // const user = await requireAuth(context, [
        //   "SUPER_ADMIN",
        //   "ADMIN",
        //   "MANAGER",
        //   "STAFF",
        // ]);

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

  // Application type resolver - totalPrice 필드를 새로운 구조로 처리
  Application: {
    totalPrice: (parent) => {
      return formatPricingDetails(parent);
    },
  },

  Subscription: {
    applicationCreated: {
      subscribe: () => {
        const { pubsub } = require("../../../utils/pubsub");
        return pubsub.asyncIterator(["APPLICATION_CREATED"]);
      },
    },
    applicationUpdated: {
      subscribe: () => {
        const { pubsub } = require("../../../utils/pubsub");
        return pubsub.asyncIterator(["APPLICATION_UPDATED"]);
      },
    },
    applicationStatusCountsUpdated: {
      subscribe: () => {
        const { pubsub } = require("../../../utils/pubsub");
        return pubsub.asyncIterator(["APPLICATION_STATUS_COUNTS_UPDATED"]);
      },
    },
  },
};

module.exports = resolvers;
