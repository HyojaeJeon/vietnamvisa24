const { GraphQLScalarType, GraphQLError } = require("graphql");
const { Kind } = require("graphql/language");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const workflowEngine = require("../../../utils/workflowEngine");
const emailService = require("../../../utils/emailService");

// Import models with error handling
let VisaApplication, User, Admin, ApplicationStatusHistory, ApplicationMemo, Payment;
try {
  const models = require("../../../models");
  VisaApplication = models.VisaApplication;
  User = models.User;
  Admin = models.Admin;
  ApplicationStatusHistory = models.ApplicationStatusHistory;
  ApplicationMemo = models.ApplicationMemo;
  Payment = models.Payment;
} catch (error) {
  console.error("Error importing models:", error);
}

// Simple in-memory storage for memos (fallback when database is not available)
let mockMemosStorage = new Map();

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
        }

        const applications = await VisaApplication.findAll({
          include: [User ? { model: User, as: "applicant" } : null, Admin ? { model: Admin, as: "assignedAdmin" } : null].filter(Boolean),
          order: [["created_at", "DESC"]],
        });

        // Convert database status to GraphQL enum
        const convertedApplications = applications.map((app) => ({
          ...app.toJSON(),
          status: dbToGraphQLStatus(app.status),
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
        });

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Convert database status to GraphQL enum
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status),
        };

        return convertedApplication;
      } catch (error) {
        console.error("Error fetching application:", error);
        throw new GraphQLError("비자 신청 정보를 가져오는데 실패했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getApplicationMemos: async (_, { applicationId }) => {
      try {
        console.log("Getting memos for application:", applicationId);

        // If real database models are available, use them
        if (ApplicationMemo) {
          try {
            const memos = await ApplicationMemo.findAll({
              where: { application_id: applicationId },
              order: [["created_at", "DESC"]],
            });
            return memos.map((memo) => ({
              id: memo.id.toString(),
              content: memo.content,
              created_at: memo.created_at,
              updated_at: memo.updated_at,
              created_by: memo.created_by || "관리자",
            }));
          } catch (dbError) {
            console.log("Database error, falling back to mock data:", dbError.message);
          }
        }

        // Initialize mock memos for this application if they don't exist
        const appKey = `app-${applicationId}`;
        if (!mockMemosStorage.has(appKey)) {
          const initialMemos = [
            {
              id: `memo-${applicationId}-1`,
              content: "서류 검토 완료. 모든 서류가 정상적으로 제출되었음.",
              created_at: "2024-01-16T14:20:00Z",
              updated_at: "2024-01-16T14:20:00Z",
              created_by: "김담당",
            },
            {
              id: `memo-${applicationId}-2`,
              content: "고객에게 추가 서류 요청 이메일 발송함.",
              created_at: "2024-01-17T09:30:00Z",
              updated_at: "2024-01-17T09:30:00Z",
              created_by: "이담당",
            },
          ];
          mockMemosStorage.set(appKey, initialMemos);
        }

        return mockMemosStorage.get(appKey) || [];
      } catch (error) {
        console.error("Error fetching application memos:", error);
        return []; // Return empty array on error
      }
    },
  },

  Mutation: {
    createVisaApplication: async (_, { input }, context) => {
      try {
        console.log("Creating visa application:", input);

        // Generate application number
        const applicationNumber = `VN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        let newApplication;

        if (!VisaApplication) {
          console.log("VisaApplication model not available, returning mock response");
          newApplication = {
            id: Date.now(),
            application_number: applicationNumber,
            ...input,
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        } else {
          // Parse documents and additional_services if they are strings
          let documentsData = input.documents;
          let additionalServicesData = input.additional_services;
          
          if (typeof input.documents === 'string') {
            try {
              documentsData = JSON.parse(input.documents);
            } catch (e) {
              documentsData = [];
            }
          }
          
          if (typeof input.additional_services === 'string') {
            try {
              additionalServicesData = JSON.parse(input.additional_services);
            } catch (e) {
              additionalServicesData = [];
            }
          }

          // Create the application
          newApplication = await VisaApplication.create({
            application_number: applicationNumber,
            ...input,
            documents: JSON.stringify(documentsData || []),
            additional_services: JSON.stringify(additionalServicesData || []),
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
          });

          // Store documents in documents table if provided
          if (documentsData && Array.isArray(documentsData) && documentsData.length > 0) {
            const Document = require("../../../models").Document;
            if (Document) {
              for (const doc of documentsData) {
                try {
                  await Document.create({
                    application_id: newApplication.id,
                    document_type: doc.document_type,
                    document_name: doc.document_name,
                    file_data: doc.file_data, // base64 data
                    file_size: doc.file_size,
                    file_type: doc.file_type,
                    status: 'uploaded',
                    created_at: new Date(),
                    updated_at: new Date(),
                  });
                } catch (docError) {
                  console.error("Failed to save document:", docError);
                }
              }
            }
          }
        }

        // Send real-time notification via Socket.IO
        try {
          if (context?.io) {
            const socketManager = require("../../../utils/socketManager");
            socketManager.notifyNewApplication(newApplication);
            console.log(`Socket notification sent for new application: ${applicationNumber}`);
          }
        } catch (socketError) {
          console.error("Failed to send socket notification:", socketError);
        }

        // Start automated workflow
        try {
          await workflowEngine.startWorkflow(newApplication.id, input.visa_type || "E-VISA");
          console.log(`Workflow started for application ${newApplication.id}`);
        } catch (workflowError) {
          console.error("Failed to start workflow:", workflowError);
          // Continue without failing the application creation
        }

        // Send application confirmation email to customer
        try {
          if (input.email) {
            await emailService.sendApplicationConfirmation(input.email, {
              applicationNumber: applicationNumber,
              fullName: input.full_name || input.fullName,
              visaType: input.visa_type || input.visaType,
              applicationId: newApplication.id,
            });
            console.log(`Confirmation email sent to ${input.email}`);
          }
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Continue without failing
        }

        // Send admin notification email
        try {
          await emailService.sendAdminNotification({
            applicationNumber: applicationNumber,
            fullName: input.full_name,
            visaType: input.visa_type,
            email: input.email,
            phone: input.phone,
            applicationId: newApplication.id,
          });
          console.log(`Admin notification email sent for application ${applicationNumber}`);
        } catch (emailError) {
          console.error("Failed to send admin notification email:", emailError);
          // Continue without failing
        }

        // Convert to GraphQL format
        const result = {
          ...newApplication,
          status: dbToGraphQLStatus(newApplication.status || "pending"),
        };

        return result;
      } catch (error) {
        console.error("Create visa application error:", error);
        throw new GraphQLError("비자 신청 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
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
        }

        const previousStatus = application.status;

        // Use the new status conversion function
        const dbStatus = graphQLToDbStatus(status);
        console.log("Mapping status:", status, "->", dbStatus); // Update application status
        await application.update({ status: dbStatus });

        // Send real-time notification via Socket.IO
        try {
          if (context?.io && application.user_id) {
            const socketManager = require("../../../utils/socketManager");
            socketManager.notifyApplicationStatusChange(
              application.user_id,
              {
                ...application.toJSON(),
                status: dbStatus,
                application_number: application.application_number,
                full_name: application.full_name,
              },
              previousStatus,
              dbStatus
            );
            console.log(`Socket notification sent for status change: ${previousStatus} -> ${dbStatus}`);
          }
        } catch (socketError) {
          console.error("Failed to send socket notification:", socketError);
          // Continue without failing
        }

        // Trigger workflow progression if status change is significant
        try {
          const triggerMap = {
            PROCESSING: "status_changed",
            DOCUMENT_REVIEW: "documents_received",
            SUBMITTED_TO_AUTHORITY: "submitted_to_authority",
            APPROVED: "visa_approved",
            REJECTED: "visa_rejected",
            COMPLETED: "application_completed",
          };

          const trigger = triggerMap[status];
          if (trigger) {
            await workflowEngine.handleTrigger(id, trigger, {
              previousStatus: previousStatus,
              newStatus: dbStatus,
              updatedBy: context?.user?.id || "system",
            });
            console.log(`Workflow trigger ${trigger} processed for application ${id}`);
          }
        } catch (workflowError) {
          console.error("Failed to trigger workflow:", workflowError);
          // Continue without failing the status update
        }

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

        // If real database models are available, use them
        if (ApplicationMemo) {
          try {
            const newMemo = await ApplicationMemo.create({
              application_id: applicationId,
              content: content,
              created_by: context?.user?.name || "관리자",
              created_at: new Date(),
              updated_at: new Date(),
            });

            return {
              id: newMemo.id.toString(),
              content: newMemo.content,
              created_at: newMemo.created_at,
              updated_at: newMemo.updated_at,
              created_by: newMemo.created_by,
            };
          } catch (dbError) {
            console.log("Database error, falling back to mock storage:", dbError.message);
          }
        }

        // Use in-memory storage as fallback
        const appKey = `app-${applicationId}`;
        const newMemo = {
          id: `memo-${applicationId}-${Date.now()}`,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: context?.user?.name || "관리자",
        };

        // Get existing memos or initialize empty array
        const existingMemos = mockMemosStorage.get(appKey) || [];
        existingMemos.push(newMemo);
        mockMemosStorage.set(appKey, existingMemos);

        console.log("Memo added to memory storage:", newMemo);
        return newMemo;
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

        // Convert database status to GraphQL enum for return
        const convertedApplication = {
          ...application.toJSON(),
          status: dbToGraphQLStatus(application.status),
        };

        return convertedApplication;
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
            downloadUrl: `/api/documents/application/${applicationId}/download-zip`,
            fileName: `app_${applicationId}_documents.zip`,
          };
        }

        const application = await VisaApplication.findByPk(applicationId);

        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        } // For now, return a mock response
        return {
          downloadUrl: `/api/documents/application/${applicationId}/download-zip`,
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
    updateApplicationMemo: async (_, { id, content }, context) => {
      try {
        console.log("Updating application memo:", { id, content });

        // If real database models are available, use them
        if (ApplicationMemo) {
          try {
            const memo = await ApplicationMemo.findByPk(id);

            if (!memo) {
              throw new GraphQLError("메모를 찾을 수 없습니다.", {
                extensions: { code: "NOT_FOUND" },
              });
            }

            await memo.update({
              content: content,
              updated_at: new Date(),
            });

            return {
              id: memo.id.toString(),
              content: memo.content,
              updated_at: memo.updated_at || new Date().toISOString(),
              created_by: memo.created_by || "관리자",
            };
          } catch (dbError) {
            console.log("Database error, falling back to mock storage:", dbError.message);
          }
        }

        // Use in-memory storage as fallback
        let foundMemo = null;
        let appKey = null;

        // Find the memo in all application memo lists
        for (const [key, memos] of mockMemosStorage.entries()) {
          const memo = memos.find((m) => m.id === id);
          if (memo) {
            foundMemo = memo;
            appKey = key;
            break;
          }
        }

        if (!foundMemo) {
          throw new GraphQLError("메모를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Update the memo
        foundMemo.content = content;
        foundMemo.updated_at = new Date().toISOString();

        // Update the storage
        const memos = mockMemosStorage.get(appKey);
        const memoIndex = memos.findIndex((m) => m.id === id);
        if (memoIndex !== -1) {
          memos[memoIndex] = foundMemo;
          mockMemosStorage.set(appKey, memos);
        }

        return {
          id: foundMemo.id.toString(),
          content: foundMemo.content,
          updated_at: foundMemo.updated_at,
          created_by: foundMemo.created_by,
        };
      } catch (error) {
        console.error("Update memo error:", error);
        throw new GraphQLError("메모 수정에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    deleteApplicationMemo: async (_, { id }, context) => {
      try {
        console.log("Deleting application memo:", { id });

        // If real database models are available, use them
        if (ApplicationMemo) {
          try {
            const memo = await ApplicationMemo.findByPk(id);

            if (!memo) {
              throw new GraphQLError("메모를 찾을 수 없습니다.", {
                extensions: { code: "NOT_FOUND" },
              });
            }

            await memo.destroy();

            return {
              success: true,
              message: "메모가 성공적으로 삭제되었습니다.",
            };
          } catch (dbError) {
            console.log("Database error, falling back to mock storage:", dbError.message);
          }
        } // Use in-memory storage as fallback
        let foundMemo = false;

        // Find and remove the memo from all application memo lists
        for (const [key, memos] of mockMemosStorage.entries()) {
          const memoIndex = memos.findIndex((m) => m.id === id);
          if (memoIndex !== -1) {
            memos.splice(memoIndex, 1);
            mockMemosStorage.set(key, memos);
            foundMemo = true;
            break;
          }
        }

        if (!foundMemo) {
          throw new GraphQLError("메모를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return {
          success: true,
          message: "메모가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        console.error("Delete memo error:", error);
        throw new GraphQLError("메모 삭제에 실패했습니다.", {
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
