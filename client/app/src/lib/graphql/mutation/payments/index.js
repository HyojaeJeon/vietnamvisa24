
import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) {
      id
      invoice_number
      amount
      currency
      status
      due_date
      created_at
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $input: PaymentUpdateInput!) {
    updatePayment(id: $id, input: $input) {
      id
      status
      payment_method
      transaction_id
      paid_amount
      paid_at
      receipt_issued
      updated_at
    }
  }
`;

export const GENERATE_INVOICE = gql`
  mutation GenerateInvoice($applicationId: ID!) {
    generateInvoice(applicationId: $applicationId) {
      id
      invoice_number
      amount
      currency
      status
      due_date
      created_at
    }
  }
`;
