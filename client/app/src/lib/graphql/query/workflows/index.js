
import { gql } from '@apollo/client';

export const GET_WORKFLOW_TEMPLATES = gql`
  query GetWorkflowTemplates {
    getWorkflowTemplates {
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

export const GET_APPLICATION_WORKFLOW = gql`
  query GetApplicationWorkflow($applicationId: ID!) {
    getApplicationWorkflow(applicationId: $applicationId) {
      id
      application_id
      template_id
      checklist_status
      completed_at
      created_at
      template {
        id
        name
        visa_type
        checklist
      }
    }
  }
`;
