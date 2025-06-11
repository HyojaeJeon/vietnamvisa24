
import { gql } from '@apollo/client';

export const CREATE_WORKFLOW_TEMPLATE = gql`
  mutation CreateWorkflowTemplate($input: WorkflowTemplateInput!) {
    createWorkflowTemplate(input: $input) {
      id
      name
      visa_type
      checklist
      automation_rules
      is_active
      created_at
    }
  }
`;

export const UPDATE_APPLICATION_CHECKLIST = gql`
  mutation UpdateApplicationChecklist($applicationId: ID!, $input: ChecklistUpdateInput!) {
    updateApplicationChecklist(applicationId: $applicationId, input: $input) {
      id
      checklist_status
      completed_at
      updated_at
    }
  }
`;

export const INITIALIZE_WORKFLOW = gql`
  mutation InitializeWorkflow($applicationId: ID!) {
    initializeWorkflow(applicationId: $applicationId) {
      id
      application_id
      template_id
      checklist_status
      created_at
      template {
        name
        visa_type
      }
    }
  }
`;
