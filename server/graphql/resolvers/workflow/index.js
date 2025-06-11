
const { WorkflowTemplate, ApplicationWorkflow, VisaApplication } = require('../../../models');

const workflowResolvers = {
  Query: {
    getWorkflowTemplates: async () => {
      try {
        return await WorkflowTemplate.findAll({
          order: [['created_at', 'DESC']]
        });
      } catch (error) {
        console.error('Workflow templates fetch error:', error);
        return [];
      }
    },

    getWorkflowTemplate: async (_, { id }) => {
      return await WorkflowTemplate.findByPk(id);
    },

    getApplicationWorkflows: async (_, { applicationId }) => {
      return await ApplicationWorkflow.findAll({
        where: { application_id: applicationId },
        include: [
          { model: WorkflowTemplate, as: 'template' },
          { model: VisaApplication, as: 'application' }
        ],
        order: [['created_at', 'ASC']]
      });
    },

    getAllWorkflows: async () => {
      try {
        return await ApplicationWorkflow.findAll({
          include: [
            { model: WorkflowTemplate, as: 'template' },
            { model: VisaApplication, as: 'application' }
          ],
          order: [['created_at', 'DESC']]
        });
      } catch (error) {
        console.error('All workflows fetch error:', error);
        return [];
      }
    }
  },

  Mutation: {
    createWorkflowTemplate: async (_, { input }) => {
      try {
        return await WorkflowTemplate.create({
          ...input,
          created_at: new Date(),
          updated_at: new Date()
        });
      } catch (error) {
        throw new Error(`Workflow template creation failed: ${error.message}`);
      }
    },

    updateWorkflowTemplate: async (_, { id, input }) => {
      try {
        await WorkflowTemplate.update({
          ...input,
          updated_at: new Date()
        }, {
          where: { id }
        });

        return await WorkflowTemplate.findByPk(id);
      } catch (error) {
        throw new Error(`Workflow template update failed: ${error.message}`);
      }
    },

    deleteWorkflowTemplate: async (_, { id }) => {
      try {
        const deleted = await WorkflowTemplate.destroy({
          where: { id }
        });
        return deleted > 0;
      } catch (error) {
        throw new Error(`Workflow template deletion failed: ${error.message}`);
      }
    },

    createApplicationWorkflow: async (_, { input }) => {
      try {
        const workflow = await ApplicationWorkflow.create({
          ...input,
          created_at: new Date(),
          updated_at: new Date()
        });

        return await ApplicationWorkflow.findByPk(workflow.id, {
          include: [
            { model: WorkflowTemplate, as: 'template' },
            { model: VisaApplication, as: 'application' }
          ]
        });
      } catch (error) {
        throw new Error(`Application workflow creation failed: ${error.message}`);
      }
    },

    updateWorkflowStatus: async (_, { id, status, notes }) => {
      try {
        await ApplicationWorkflow.update({
          status,
          notes,
          completed_at: status === 'completed' ? new Date() : null,
          updated_at: new Date()
        }, {
          where: { id }
        });

        return await ApplicationWorkflow.findByPk(id, {
          include: [
            { model: WorkflowTemplate, as: 'template' },
            { model: VisaApplication, as: 'application' }
          ]
        });
      } catch (error) {
        throw new Error(`Workflow status update failed: ${error.message}`);
      }
    },

    assignWorkflow: async (_, { id, assignedTo }) => {
      try {
        await ApplicationWorkflow.update({
          assigned_to: assignedTo,
          updated_at: new Date()
        }, {
          where: { id }
        });

        return await ApplicationWorkflow.findByPk(id, {
          include: [
            { model: WorkflowTemplate, as: 'template' },
            { model: VisaApplication, as: 'application' }
          ]
        });
      } catch (error) {
        throw new Error(`Workflow assignment failed: ${error.message}`);
      }
    },

    applyWorkflowTemplate: async (_, { applicationId, templateId }) => {
      try {
        const template = await WorkflowTemplate.findByPk(templateId);
        if (!template) {
          throw new Error('Workflow template not found');
        }

        const workflow = await ApplicationWorkflow.create({
          application_id: applicationId,
          template_id: templateId,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        });

        return await ApplicationWorkflow.findByPk(workflow.id, {
          include: [
            { model: WorkflowTemplate, as: 'template' },
            { model: VisaApplication, as: 'application' }
          ]
        });
      } catch (error) {
        throw new Error(`Workflow template application failed: ${error.message}`);
      }
    }
  }
};

module.exports = workflowResolvers;
