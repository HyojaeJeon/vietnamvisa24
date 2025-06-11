
import { gql } from '@apollo/client';

export const GET_PAYMENTS = gql`
  query GetPayments {
    getPayments {
      id
      application_id
      invoice_number
      amount
      currency
      status
      payment_method
      transaction_id
      paid_amount
      due_date
      paid_at
      receipt_requested
      receipt_issued
      notes
      created_at
      updated_at
      application {
        id
        full_name
        visa_type
        status
      }
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      application_id
      invoice_number
      amount
      currency
      status
      payment_method
      transaction_id
      paid_amount
      due_date
      paid_at
      receipt_requested
      receipt_issued
      notes
      created_at
      updated_at
      application {
        id
        full_name
        visa_type
        status
        email
        phone
      }
    }
  }
`;

export const GET_PAYMENTS_BY_APPLICATION = gql`
  query GetPaymentsByApplication($applicationId: ID!) {
    getPaymentsByApplication(applicationId: $applicationId) {
      id
      invoice_number
      amount
      currency
      status
      payment_method
      paid_amount
      due_date
      paid_at
      receipt_requested
      receipt_issued
      created_at
    }
  }
`;
