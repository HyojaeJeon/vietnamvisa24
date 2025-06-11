
const { gql } = require("graphql-tag");

const workflowTypeDefs = gql`
  type WorkflowTemplate {
    id: ID!
    name: String!
    visa_type: String!
    checklist: JSON!
    automation_rules: JSON
    is_active: Boolean!
    created_at: String!
    updated_at: String!
  }

  type ApplicationWorkflow {
    id: ID!
    application_id: ID!
    template_id: ID!
    status: String!
    assigned_to: String
    notes: String
    checklist_status: JSON
    completed_at: String
    created_at: String!
    updated_at: String!
    application: VisaApplication
    template: WorkflowTemplate
  }

  input WorkflowTemplateInput {
    name: String!
    visa_type: String!
    checklist: JSON!
    automation_rules: JSON
  }

  input ApplicationWorkflowInput {
    application_id: ID!
    template_id: ID!
    status: String
    assigned_to: String
    notes: String
  }

  input ChecklistUpdateInput {
    checklist_status: JSON!
  }

  extend type Query {
    getWorkflowTemplates: [WorkflowTemplate!]!
    getWorkflowTemplate(id: ID!): WorkflowTemplate
    getApplicationWorkflow(applicationId: ID!): ApplicationWorkflow
    getApplicationWorkflows(applicationId: ID!): [ApplicationWorkflow!]!
    getAllWorkflows: [ApplicationWorkflow!]!
  }

  extend type Mutation {
    createWorkflowTemplate(input: WorkflowTemplateInput!): WorkflowTemplate!
    updateWorkflowTemplate(id: ID!, input: WorkflowTemplateInput!): WorkflowTemplate!
    deleteWorkflowTemplate(id: ID!): Boolean!
    createApplicationWorkflow(input: ApplicationWorkflowInput!): ApplicationWorkflow!
    updateWorkflowStatus(id: ID!, status: String!, notes: String): ApplicationWorkflow!
    assignWorkflow(id: ID!, assignedTo: String!): ApplicationWorkflow!
    applyWorkflowTemplate(applicationId: ID!, templateId: ID!): ApplicationWorkflow!
    updateApplicationChecklist(applicationId: ID!, input: ChecklistUpdateInput!): ApplicationWorkflow!
    initializeWorkflow(applicationId: ID!): ApplicationWorkflow!
  }
`;

module.exports = workflowTypeDefs;
