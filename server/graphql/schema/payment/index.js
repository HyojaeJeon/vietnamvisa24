
const { gql } = require("graphql-tag");

const paymentTypeDefs = gql`
  type Payment {
    id: ID!
    application_id: ID!
    invoice_number: String!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    payment_method: String
    transaction_id: String
    paid_amount: Float!
    due_date: String
    paid_at: String
    receipt_requested: Boolean!
    receipt_issued: Boolean!
    notes: String
    created_at: String!
    updated_at: String!
    application: VisaApplication
  }

  enum PaymentStatus {
    pending
    partial
    paid
    overdue
    cancelled
  }

  input PaymentInput {
    application_id: ID!
    amount: Float!
    currency: String
    due_date: String
    notes: String
  }

  input PaymentUpdateInput {
    status: PaymentStatus
    payment_method: String
    transaction_id: String
    paid_amount: Float
    paid_at: String
    receipt_requested: Boolean
    receipt_issued: Boolean
    notes: String
  }

  extend type Query {
    getPayments: [Payment!]!
    getPayment(id: ID!): Payment
    getPaymentsByApplication(applicationId: ID!): [Payment!]!
  }

  input RecordPaymentInput {
    amount: Float!
    payment_method: String!
  }

  extend type Mutation {
    createPayment(input: PaymentInput!): Payment!
    updatePayment(id: ID!, input: PaymentUpdateInput!): Payment!
    generateInvoice(applicationId: ID!): Payment!
    recordPayment(paymentId: ID!, input: RecordPaymentInput!): Payment!
  }
`;

module.exports = paymentTypeDefs;
