const {
  WorkflowTemplate,
  ApplicationWorkflow,
  VisaApplication,
} = require("../../../models");
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");

const workflowResolvers = {
  Query: {
    getWorkflowTemplates: async (_, __, context) => {
      try {
        // 관리자와 매니저만 워크플로우 템플릿 조회 가능
        await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

        return await WorkflowTemplate.findAll({
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching workflow templates:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿을 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    getWorkflowTemplate: async (_, { id }, context) => {
      try {
        // 관리자와 매니저만 워크플로우 템플릿 상세 조회 가능
        await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

        const template = await WorkflowTemplate.findByPk(id);

        if (!template) {
          throw new GraphQLError("워크플로우 템플릿을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return template;
      } catch (error) {
        console.error("Error fetching workflow template:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿을 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
    getApplicationWorkflows: async (_, { applicationId }, { accessToken }) => {
      try {
        await requireAuth(accessToken);

        return await ApplicationWorkflow.findAll({
          where: { application_id: applicationId },
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
          order: [["created_at", "ASC"]],
        });
      } catch (error) {
        console.error("Error fetching application workflows:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "신청서 워크플로우를 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
    getAllWorkflows: async (_, __, context) => {
      try {
        // 관리자와 매니저만 모든 워크플로우 조회 가능
        await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

        return await ApplicationWorkflow.findAll({
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching all workflows:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "전체 워크플로우를 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
  },
  Mutation: {
    createWorkflowTemplate: async (_, { input }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        return await WorkflowTemplate.create({
          ...input,
          created_at: new Date(),
          updated_at: new Date(),
        });
      } catch (error) {
        console.error("Error creating workflow template:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿 생성 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    updateWorkflowTemplate: async (_, { id, input }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        const template = await WorkflowTemplate.findByPk(id);
        if (!template) {
          throw new GraphQLError("워크플로우 템플릿을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await WorkflowTemplate.update(
          {
            ...input,
            updated_at: new Date(),
          },
          {
            where: { id },
          },
        );

        return await WorkflowTemplate.findByPk(id);
      } catch (error) {
        console.error("Error updating workflow template:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿 업데이트 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    deleteWorkflowTemplate: async (_, { id }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        const template = await WorkflowTemplate.findByPk(id);
        if (!template) {
          throw new GraphQLError("워크플로우 템플릿을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const deleted = await WorkflowTemplate.destroy({
          where: { id },
        });
        return deleted > 0;
      } catch (error) {
        console.error("Error deleting workflow template:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿 삭제 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    createApplicationWorkflow: async (_, { input }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        const workflow = await ApplicationWorkflow.create({
          ...input,
          created_at: new Date(),
          updated_at: new Date(),
        });

        return await ApplicationWorkflow.findByPk(workflow.id, {
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
        });
      } catch (error) {
        console.error("Error creating application workflow:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "신청서 워크플로우 생성 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    updateWorkflowStatus: async (_, { id, status, notes }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        const workflow = await ApplicationWorkflow.findByPk(id);
        if (!workflow) {
          throw new GraphQLError("워크플로우를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await ApplicationWorkflow.update(
          {
            status,
            notes,
            completed_at: status === "completed" ? new Date() : null,
            updated_at: new Date(),
          },
          {
            where: { id },
          },
        );

        return await ApplicationWorkflow.findByPk(id, {
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
        });
      } catch (error) {
        console.error("Error updating workflow status:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 상태 업데이트 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    assignWorkflow: async (_, { id, assignedTo }, { adminToken }) => {
      try {
        await requireAuth(adminToken);

        const workflow = await ApplicationWorkflow.findByPk(id);
        if (!workflow) {
          throw new GraphQLError("워크플로우를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await ApplicationWorkflow.update(
          {
            assigned_to: assignedTo,
            updated_at: new Date(),
          },
          {
            where: { id },
          },
        );

        return await ApplicationWorkflow.findByPk(id, {
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
        });
      } catch (error) {
        console.error("Error assigning workflow:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("워크플로우 할당 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    applyWorkflowTemplate: async (
      _,
      { applicationId, templateId },
      { adminToken },
    ) => {
      try {
        await requireAuth(adminToken);

        const template = await WorkflowTemplate.findByPk(templateId);
        if (!template) {
          throw new GraphQLError("워크플로우 템플릿을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const application = await VisaApplication.findByPk(applicationId);
        if (!application) {
          throw new GraphQLError("비자 신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const workflow = await ApplicationWorkflow.create({
          application_id: applicationId,
          template_id: templateId,
          status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
        });

        return await ApplicationWorkflow.findByPk(workflow.id, {
          include: [
            { model: WorkflowTemplate, as: "template" },
            { model: VisaApplication, as: "application" },
          ],
        });
      } catch (error) {
        console.error("Error applying workflow template:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "워크플로우 템플릿 적용 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
  },
};

module.exports = workflowResolvers;
