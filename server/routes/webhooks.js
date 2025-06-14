const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { Payment, VisaApplication } = require("../models");
const { sendEmail } = require("../utils/emailService");
const workflowEngine = require("../utils/workflowEngine");
const socketManager = require("../utils/socketManager");

// Stripe 웹훅 처리
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Stripe 시그니처 검증
    if (endpointSecret) {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body);
    }

    console.log(`🔄 Stripe Webhook received: ${event.type}`);

    // 결제 관련 이벤트 처리
    switch (event.type) {
      case "payment_intent.succeeded":
        await handleStripePaymentSuccess(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handleStripePaymentFailed(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleStripeInvoicePaymentSuccess(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleStripeInvoicePaymentFailed(event.data.object);
        break;
      default:
        console.log(`⚠️ Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// PayPal 웹훅 처리
router.post("/paypal", express.json(), async (req, res) => {
  try {
    const event = req.body;

    // PayPal 웹훅 검증 (선택사항)
    if (process.env.PAYPAL_WEBHOOK_ID) {
      await verifyPayPalWebhook(req);
    }

    console.log(`🔄 PayPal Webhook received: ${event.event_type}`);

    // PayPal 이벤트 처리
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePayPalPaymentCompleted(event.resource);
        break;
      case "PAYMENT.CAPTURE.DENIED":
        await handlePayPalPaymentDenied(event.resource);
        break;
      case "INVOICING.INVOICE.PAID":
        await handlePayPalInvoicePaid(event.resource);
        break;
      default:
        console.log(`⚠️ Unhandled PayPal event type: ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ PayPal webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// 토스페이 웹훅 처리
router.post("/toss", express.json(), async (req, res) => {
  try {
    const { eventType, data } = req.body;

    console.log(`🔄 TossPay Webhook received: ${eventType}`);

    switch (eventType) {
      case "PAYMENT_CONFIRMED":
        await handleTossPaymentConfirmed(data);
        break;
      case "PAYMENT_FAILED":
        await handleTossPaymentFailed(data);
        break;
      case "PAYMENT_CANCELED":
        await handleTossPaymentCanceled(data);
        break;
      default:
        console.log(`⚠️ Unhandled TossPay event type: ${eventType}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ TossPay webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// 일반 웹훅 처리 (사용자 정의)
router.post("/generic", express.json(), async (req, res) => {
  try {
    const { eventType, paymentData, metadata } = req.body;

    console.log(`🔄 Generic Webhook received: ${eventType}`);

    switch (eventType) {
      case "payment_completed":
        await handleGenericPaymentCompleted(paymentData, metadata);
        break;
      case "payment_failed":
        await handleGenericPaymentFailed(paymentData, metadata);
        break;
      default:
        console.log(`⚠️ Unhandled generic event type: ${eventType}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Generic webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// === Stripe 핸들러 함수들 ===
async function handleStripePaymentSuccess(paymentIntent) {
  try {
    const invoiceNumber = paymentIntent.metadata?.invoice_number;
    if (!invoiceNumber) return;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (!payment) {
      console.log(`⚠️ Payment not found for invoice: ${invoiceNumber}`);
      return;
    }

    // 결제 상태 업데이트
    await payment.update({
      status: "paid",
      payment_method: "stripe",
      transaction_id: paymentIntent.id,
      paid_amount: paymentIntent.amount_received / 100, // Stripe는 센트 단위
      paid_at: new Date(),
    });

    // 워크플로우 트리거 및 실시간 알림
    if (payment.application) {
      // 워크플로우 엔진 트리거
      if (typeof workflowEngine?.handleTrigger === "function") {
        await workflowEngine.handleTrigger(payment.application.id, "payment_completed", {
          paymentId: payment.id,
          amount: payment.paid_amount,
          currency: paymentIntent.currency,
        });
      }
      // 실시간 알림
      if (typeof socketManager?.notifyUser === "function") {
        socketManager.notifyUser(payment.application.user_id, {
          type: "payment_success",
          title: "결제 완료",
          message: "결제가 성공적으로 처리되었습니다. 비자 처리를 시작합니다.",
          applicationId: payment.application.id,
        });
      }
      // 이메일 알림 (템플릿에 맞게 데이터 전달)
      await sendEmail(payment.application.email, "payment_confirmation", {
        customerName: payment.application.full_name,
        invoiceNumber: payment.invoice_number,
        paymentMethod: payment.payment_method,
        visaType: payment.application.visa_type,
        paidAt: payment.paid_at,
        amount: payment.paid_amount,
        currency: paymentIntent.currency,
      });
    }
    console.log(`✅ Stripe payment processed for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling Stripe payment success:", error);
  }
}

async function handleStripePaymentFailed(paymentIntent) {
  try {
    const invoiceNumber = paymentIntent.metadata?.invoice_number;
    if (!invoiceNumber) return;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (payment) {
      await payment.update({
        status: "overdue",
        notes: `Stripe payment failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
      });
      // 실시간 알림
      if (payment.application && typeof socketManager?.notifyUser === "function") {
        socketManager.notifyUser(payment.application.user_id, {
          type: "payment_failed",
          title: "결제 실패",
          message: "결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
          applicationId: payment.application.id,
        });
      }
      // 이메일 알림
      if (payment.application) {
        await sendEmail(payment.application.email, "payment_failed", {
          customerName: payment.application.full_name,
          invoiceNumber: payment.invoice_number,
          failureReason: paymentIntent.last_payment_error?.message || "Unknown error",
          retryUrl: `${process.env.CLIENT_URL}/apply/payment/${payment.application.id}`,
        });
      }
    }
    console.log(`❌ Stripe payment failed for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling Stripe payment failure:", error);
  }
}

async function handleStripeInvoicePaymentSuccess(invoice) {
  // Stripe 인보이스 결제 성공 처리
  console.log(`✅ Stripe invoice payment succeeded: ${invoice.id}`);
}

async function handleStripeInvoicePaymentFailed(invoice) {
  // Stripe 인보이스 결제 실패 처리
  console.log(`❌ Stripe invoice payment failed: ${invoice.id}`);
}

// === PayPal 핸들러 함수들 ===
async function handlePayPalPaymentCompleted(capture) {
  try {
    const invoiceNumber = capture.custom_id || capture.invoice_id;
    if (!invoiceNumber) return;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (payment) {
      await payment.update({
        status: "paid",
        payment_method: "paypal",
        transaction_id: capture.id,
        paid_amount: parseFloat(capture.amount.value),
        paid_at: new Date(),
      });

      if (payment.application) {
        await sendPaymentConfirmationEmail(payment.application, payment);
      }
    }

    console.log(`✅ PayPal payment completed for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling PayPal payment completion:", error);
  }
}

async function handlePayPalPaymentDenied(capture) {
  try {
    const invoiceNumber = capture.custom_id || capture.invoice_id;
    if (!invoiceNumber) return;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (payment) {
      await payment.update({
        status: "overdue",
        notes: "PayPal payment denied",
      });

      if (payment.application) {
        await sendPaymentFailedEmail(payment.application, payment);
      }
    }

    console.log(`❌ PayPal payment denied for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling PayPal payment denial:", error);
  }
}

async function handlePayPalInvoicePaid(invoice) {
  console.log(`✅ PayPal invoice paid: ${invoice.id}`);
}

// === TossPay 핸들러 함수들 ===
async function handleTossPaymentConfirmed(data) {
  try {
    const invoiceNumber = data.orderId; // TossPay에서는 orderId를 invoice_number로 사용
    if (!invoiceNumber) return;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (payment) {
      await payment.update({
        status: "paid",
        payment_method: "toss",
        transaction_id: data.paymentKey,
        paid_amount: data.totalAmount,
        paid_at: new Date(),
      });

      if (payment.application) {
        await sendPaymentConfirmationEmail(payment.application, payment);
      }
    }

    console.log(`✅ TossPay payment confirmed for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling TossPay payment confirmation:", error);
  }
}

async function handleTossPaymentFailed(data) {
  console.log(`❌ TossPay payment failed: ${data.orderId}`);
}

async function handleTossPaymentCanceled(data) {
  console.log(`❌ TossPay payment canceled: ${data.orderId}`);
}

// === 일반 핸들러 함수들 ===
async function handleGenericPaymentCompleted(paymentData, metadata) {
  try {
    const { invoiceNumber, amount, transactionId, paymentMethod } = paymentData;

    const payment = await Payment.findOne({
      where: { invoice_number: invoiceNumber },
      include: [{ model: VisaApplication, as: "application" }],
    });

    if (payment) {
      await payment.update({
        status: "paid",
        payment_method: paymentMethod || "generic",
        transaction_id: transactionId,
        paid_amount: amount,
        paid_at: new Date(),
        notes: metadata?.notes || null,
      });

      if (payment.application) {
        await sendPaymentConfirmationEmail(payment.application, payment);
      }
    }

    console.log(`✅ Generic payment completed for invoice: ${invoiceNumber}`);
  } catch (error) {
    console.error("❌ Error handling generic payment completion:", error);
  }
}

async function handleGenericPaymentFailed(paymentData, metadata) {
  console.log(`❌ Generic payment failed: ${paymentData.invoiceNumber}`);
}

// === 유틸리티 함수들 ===
async function verifyPayPalWebhook(req) {
  // PayPal 웹훅 검증 로직 (간소화)
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const expectedSignature = req.headers["paypal-transmission-sig"];

  // 실제 환경에서는 PayPal SDK를 사용하여 서명 검증
  // 여기서는 간단히 헤더 존재 여부만 확인
  if (!expectedSignature) {
    throw new Error("Missing PayPal signature");
  }
}

async function sendPaymentConfirmationEmail(application, payment) {
  try {
    const emailData = {
      to: application.email,
      subject: `[베트남비자24] 결제 완료 - ${payment.invoice_number}`,
      template: "payment_confirmation",
      data: {
        customerName: application.full_name,
        invoiceNumber: payment.invoice_number,
        amount: payment.paid_amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        visaType: application.visa_type,
        paidAt: payment.paid_at,
      },
    };

    await sendEmail(emailData);
    console.log(`✅ Payment confirmation email sent to: ${application.email}`);
  } catch (error) {
    console.error("❌ Error sending payment confirmation email:", error);
  }
}

async function sendPaymentFailedEmail(application, payment) {
  try {
    const emailData = {
      to: application.email,
      subject: `[베트남비자24] 결제 실패 안내 - ${payment.invoice_number}`,
      template: "payment_failed",
      data: {
        customerName: application.full_name,
        invoiceNumber: payment.invoice_number,
        amount: payment.amount,
        currency: payment.currency,
        visaType: application.visa_type,
        dueDate: payment.due_date,
      },
    };

    await sendEmail(emailData);
    console.log(`✅ Payment failed email sent to: ${application.email}`);
  } catch (error) {
    console.error("❌ Error sending payment failed email:", error);
  }
}

module.exports = router;
