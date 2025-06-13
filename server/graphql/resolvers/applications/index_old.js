const { GraphQLScalarType, GraphQLError } = require("graphql");
const { Kind } = require("graphql/language");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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

// Date scalar type
const DateType = new GraphQLScalarType({
  name: "Date",
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Status conversion functions
const dbToGraphQLStatus = (dbStatus) => {
  const statusMapping = {
    'pending': 'PENDING',
    'processing': 'PROCESSING',
    'document_review': 'DOCUMENT_REVIEW',
    'submitted_to_authority': 'SUBMITTED_TO_AUTHORITY',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'completed': 'COMPLETED'
  };
  return statusMapping[dbStatus] || dbStatus.toUpperCase();
};

const graphQLToDbStatus = (graphQLStatus) => {
  const statusMapping = {
    'PENDING': 'pending',
    'PROCESSING': 'processing',
    'DOCUMENT_REVIEW': 'document_review',
    'SUBMITTED_TO_AUTHORITY': 'submitted_to_authority',
    'APPROVED': 'approved',
    'REJECTED': 'rejected',
    'COMPLETED': 'completed'
  };
  return statusMapping[graphQLStatus] || graphQLStatus.toLowerCase();
};

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const resolvers = {
  Date: DateType,

  Query: {
    getVisaApplications: async () => {
      try {
        if (!VisaApplication) {
          console.log("VisaApplication model not available, returning mock data");
          return [
            {
              id: 1,
              application_number: "VN-2024-001",
              full_name: "김민수",
              visa_type: "E-visa",
              status: "PENDING",
              created_at: "2024-01-15T09:30:00Z",
              updated_at: "2024-01-16T14:20:00Z",
              email: "minsu.kim@email.com",
              phone: "010-1234-5678",
              nationality: "대한민국",
              passport_number: "M12345678",
              arrival_date: "2024-02-15",
              departure_date: "2024-02-25",
              priority: "normal",
            },
            {
              id: 2,
              application_number: "VN-2024-002",
              full_name: "이영희",
              visa_type: "Business Visa",
              status: "PROCESSING",
              created_at: "2024-01-14T16:45:00Z",
              updated_at: "2024-01-16T10:15:00Z",
              email: "younghee.lee@company.com",
              phone: "010-9876-5432",
              nationality: "대한민국",
              passport_number: "M87654321",
              arrival_date: "2024-02-20",
              departure_date: "2024-03-20",
              priority: "high",
            },
          ];
        }        const applications = await VisaApplication.findAll({
          include: [User ? { model: User, as: "applicant" } : null, Admin ? { model: Admin, as: "assignedAdmin" } : null].filter(Boolean),
          order: [["created_at", "DESC"]],
        });

        // Convert database status to GraphQL enum
        const convertedApplications = applications.map(app => ({
          ...app.toJSON(),
          status: dbToGraphQLStatus(app.status)
        }));

        return convertedApplications;
      } catch (error) {
        console.error("Error fetching applications:", error);
        throw new GraphQLError("비자 신청 목록을 가져오는데 실패했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getVisaApplication: async (_, { id }) => {
      try {
        if (!VisaApplication) {
          throw new GraphQLError("VisaApplication model not available");
        }

        const application = await VisaApplication.findByPk(id, {
          include: [User ? { model: User, as: "applicant" } : null, Admin ? { model: Admin, as: "assignedAdmin" } : null].filter(Boolean),
        });        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Convert database status to GraphQL enum
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status)
        };

        return convertedApplication;
      } catch (error) {
        console.error("Error fetching application:", error);
        throw new GraphQLError("비자 신청 정보를 가져오는데 실패했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Mutation: {
    updateApplicationStatus: async (_, { id, status }, context) => {
      try {
        console.log("Updating application status:", { id, status });

        if (!VisaApplication) {
          console.log("VisaApplication model not available, returning mock response");
          return {
            id: id,
            status: status,
            updated_at: new Date().toISOString(),
            application_number: `VN-2024-${id.toString().padStart(3, "0")}`,
            full_name: "Mock Application",
          };
        }

        const application = await VisaApplication.findByPk(id);

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }        const previousStatus = application.status;

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
          // Continue without failing if history table doesn't exist        }

        // Convert database status to GraphQL enum for return
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status)
        };

        return convertedApplication;
      } catch (error) {
        console.error("Status update error:", error);
        throw new GraphQLError("상태 업데이트에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    sendEmailToCustomer: async (_, { applicationId, emailType, content }) => {
      try {
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
        console.log("Adding memo:", { applicationId, content });

        // For now, we'll return a mock memo
        const memo = {
          id: Date.now().toString(),
          content,
          created_at: new Date().toISOString(),
          created_by: context?.user?.name || "System",
        };

        console.log("Memo added (mock):", memo);
        return memo;
      } catch (error) {
        console.error("Add memo error:", error);
        throw new GraphQLError("메모 추가에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    updateApplicationInfo: async (_, { id, input }) => {
      try {
        console.log("Updating application info:", { id, input });

        if (!VisaApplication) {
          console.log("VisaApplication model not available, returning mock response");
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
        return application;
      } catch (error) {
        console.error("Update application info error:", error);
        throw new GraphQLError("신청 정보 수정에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    downloadApplicationDocuments: async (_, { applicationId }) => {
      try {
        console.log("Downloading documents for application:", applicationId);

        if (!VisaApplication) {
          console.log("VisaApplication model not available, returning mock response");
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
          fileName: `${application.application_number || "app_" + applicationId}_documents.zip`,
        };
      } catch (error) {
        console.error("Download documents error:", error);
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
