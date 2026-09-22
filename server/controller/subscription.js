 import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

import auth from "../models/auth.js";
import Subscription from "../models/subscription.js";
import PaymentHistory from "../models/paymentHistory.js";

// =====================================================
// RAZORPAY HELPER
// =====================================================

const getRazorpay = () => {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error(
      "Razorpay API keys are missing in .env"
    );
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// =====================================================
// PLANS
// =====================================================

const PLANS = {
  Bronze: {
    amount: 99,
    questionsPerDay: 5,
    badge: "Bronze",
    planId: process.env.RAZORPAY_BRONZE_PLAN_ID,
  },

  Silver: {
    amount: 299,
    questionsPerDay: 15,
    badge: "Silver",
    planId: process.env.RAZORPAY_SILVER_PLAN_ID,
  },

  Gold: {
    amount: 999,
    questionsPerDay: "Unlimited",
    badge: "Gold",
    planId: process.env.RAZORPAY_GOLD_PLAN_ID,
  },
};

// =====================================================
// GET ALL PLANS
// =====================================================

export const getPlans = async (req, res) => {
  try {
    res.status(200).json({
      demoPayment:
        process.env.DEMO_PAYMENT === "true",

      plans: [
        {
          name: "Free",
          amount: 0,
          questionsPerDay: 1,
          badge: "None",
          features: [
            "1 question per day",
            "Basic search",
          ],
        },

        {
          name: "Bronze",
          amount: 99,
          questionsPerDay: 5,
          badge: "Bronze",
          features: [
            "5 questions per day",
            "Bronze badge",
            "Advanced search filters",
          ],
        },

        {
          name: "Silver",
          amount: 299,
          questionsPerDay: 15,
          badge: "Silver",
          features: [
            "15 questions per day",
            "Silver badge",
            "Priority support",
            "Enhanced profile visibility",
            "Unlimited bookmarks",
          ],
        },

        {
          name: "Gold",
          amount: 999,
          questionsPerDay: "Unlimited",
          badge: "Gold",
          features: [
            "Unlimited questions",
            "Gold badge",
            "Highest search priority",
            "Featured profile",
            "Priority customer support",
            "Exclusive community features",
          ],
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get plans",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE SUBSCRIPTION
// =====================================================

export const createSubscription = async (req, res) => {
  try {
    const userid = req.userid;
    const { plan } = req.body;

    if (!["Bronze", "Silver", "Gold"].includes(plan)) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const selectedPlan = PLANS[plan];

    const user = await auth.findById(userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =================================================
    // DEMO PAYMENT MODE
    // =================================================

    if (process.env.DEMO_PAYMENT === "true") {
      const demoSubscriptionId =
        `demo_sub_${Date.now()}_${Math.floor(
          Math.random() * 10000
        )}`;

      const subscription = new Subscription({
        userid: userid.toString(),
        plan: plan,
        amount: selectedPlan.amount,

        razorpayPlanId: "",
        razorpaySubscriptionId:
          demoSubscriptionId,

        status: "created",
      });

      await subscription.save();

      return res.status(201).json({
        message:
          "Demo subscription created successfully",

        demoPayment: true,

        subscriptionId:
          demoSubscriptionId,

        plan: plan,

        amount: selectedPlan.amount,

        keyId: "",

        shortUrl: "",
      });
    }

    // =================================================
    // REAL RAZORPAY MODE
    // =================================================

    if (!selectedPlan.planId) {
      return res.status(400).json({
        message:
          `${plan} Razorpay Plan ID is missing in .env`,
      });
    }

    const razorpay = getRazorpay();

    const razorpaySubscription =
      await razorpay.subscriptions.create({
        plan_id: selectedPlan.planId,

        total_count: 12,

        quantity: 1,

        customer_notify: 1,

        notes: {
          userid: userid.toString(),
          plan: plan,
        },
      });

    const subscription = new Subscription({
      userid: userid.toString(),
      plan: plan,
      amount: selectedPlan.amount,

      razorpayPlanId:
        selectedPlan.planId,

      razorpaySubscriptionId:
        razorpaySubscription.id,

      status: "created",
    });

    await subscription.save();

    res.status(201).json({
      message:
        "Subscription created successfully",

      demoPayment: false,

      subscriptionId:
        razorpaySubscription.id,

      plan: plan,

      amount: selectedPlan.amount,

      keyId:
        process.env.RAZORPAY_KEY_ID,

      shortUrl:
        razorpaySubscription.short_url,
    });

  } catch (error) {
    console.log(
      "Create subscription error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create subscription",

      error: error.message,
    });
  }
};

// =====================================================
// ACTIVATE DEMO SUBSCRIPTION
// =====================================================

const activateSubscription = async (
  userid,
  subscription,
  paymentId
) => {
  const startDate = new Date();

  const renewalDate = new Date(
    startDate
  );

  renewalDate.setMonth(
    renewalDate.getMonth() + 1
  );

  const endDate = new Date(
    renewalDate
  );

  // Activate subscription
  subscription.status = "active";

  subscription.startDate =
    startDate;

  subscription.endDate =
    endDate;

  subscription.renewalDate =
    renewalDate;

  subscription.cancelAtCycleEnd =
    false;

  await subscription.save();

  // Update user
  const user =
    await auth.findById(userid);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  user.subscriptionPlan =
    subscription.plan;

  user.subscriptionStatus =
    "active";

  user.razorpaySubscriptionId =
    subscription.razorpaySubscriptionId;

  user.subscriptionStartDate =
    startDate;

  user.subscriptionEndDate =
    endDate;

  user.renewalDate =
    renewalDate;

  user.billingName =
    user.name || "";

  user.billingEmail =
    user.email || "";

  await user.save();

  // Unique invoice number
  const invoiceNumber =
    "INV-" +
    Date.now() +
    "-" +
    Math.floor(
      Math.random() * 10000
    );

  // Save payment
  const payment =
    new PaymentHistory({
      userid: userid.toString(),

      plan:
        subscription.plan,

      amount:
        subscription.amount,

      razorpayPaymentId:
        paymentId,

      razorpaySubscriptionId:
        subscription.razorpaySubscriptionId,

      invoiceNumber:
        invoiceNumber,

      paymentStatus:
        "paid",
    });

  await payment.save();

  // Send email if configured
  await sendInvoiceEmail(
    user,
    payment
  );

  return {
    user,
    subscription,
    payment,
    invoiceNumber,
  };
};

// =====================================================
// VERIFY PAYMENT
// =====================================================

export const verifySubscriptionPayment =
  async (req, res) => {
    try {
      const userid =
        req.userid;

      // =================================================
      // DEMO PAYMENT
      // =================================================

      if (
        process.env.DEMO_PAYMENT ===
        "true"
      ) {
        const {
          razorpay_subscription_id,
        } = req.body;

        if (
          !razorpay_subscription_id
        ) {
          return res.status(400).json({
            message:
              "Demo subscription ID is missing",
          });
        }

        const subscription =
          await Subscription.findOne({
            userid:
              userid.toString(),

            razorpaySubscriptionId:
              razorpay_subscription_id,
          });

        if (!subscription) {
          return res.status(404).json({
            message:
              "Subscription not found",
          });
        }

        const paymentId =
          `demo_pay_${Date.now()}`;

        const result =
          await activateSubscription(
            userid,
            subscription,
            paymentId
          );

        return res.status(200).json({
          message:
            "Demo payment successful",

          demoPayment: true,

          subscription: {
            plan:
              result.subscription.plan,

            status:
              result.subscription.status,

            startDate:
              result.subscription.startDate,

            renewalDate:
              result.subscription.renewalDate,
          },

          invoiceNumber:
            result.invoiceNumber,
        });
      }

      // =================================================
      // REAL RAZORPAY PAYMENT
      // =================================================

      const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_subscription_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Payment verification details are missing",
        });
      }

      const subscription =
        await Subscription.findOne({
          userid:
            userid.toString(),

          razorpaySubscriptionId:
            razorpay_subscription_id,
        });

      if (!subscription) {
        return res.status(404).json({
          message:
            "Subscription not found",
        });
      }

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(
            razorpay_payment_id +
              "|" +
              razorpay_subscription_id
          )
          .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Invalid payment signature",
        });
      }

      const result =
        await activateSubscription(
          userid,
          subscription,
          razorpay_payment_id
        );

      res.status(200).json({
        message:
          "Payment verified successfully",

        subscription: {
          plan:
            result.subscription.plan,

          status:
            result.subscription.status,

          startDate:
            result.subscription.startDate,

          renewalDate:
            result.subscription.renewalDate,
        },

        invoiceNumber:
          result.invoiceNumber,
      });

    } catch (error) {
      console.log(
        "Payment verification error:",
        error
      );

      res.status(500).json({
        message:
          "Payment verification failed",

        error:
          error.message,
      });
    }
  };

// =====================================================
// GET CURRENT SUBSCRIPTION
// =====================================================

export const getMySubscription =
  async (req, res) => {
    try {
      const userid =
        req.userid.toString();

      const subscription =
        await Subscription.findOne({
          userid,
        }).sort({
          createdAt: -1,
        });

      const user =
        await auth.findById(
          userid
        );

      res.status(200).json({
        subscription:
          subscription || null,

        userSubscription: {
          plan:
            user?.subscriptionPlan ||
            "Free",

          status:
            user?.subscriptionStatus ||
            "inactive",

          renewalDate:
            user?.renewalDate ||
            null,

          billingName:
            user?.billingName ||
            user?.name ||
            "",

          billingEmail:
            user?.billingEmail ||
            user?.email ||
            "",

          billingPhone:
            user?.billingPhone ||
            "",
        },
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to get subscription",

        error:
          error.message,
      });
    }
  };

// =====================================================
// PAYMENT HISTORY
// =====================================================

export const getPaymentHistory =
  async (req, res) => {
    try {
      const payments =
        await PaymentHistory.find({
          userid:
            req.userid.toString(),
        }).sort({
          paymentDate: -1,
        });

      res.status(200).json({
        payments,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to get payment history",

        error:
          error.message,
      });
    }
  };

// =====================================================
// DOWNLOAD INVOICE
// =====================================================

export const downloadInvoice =
  async (req, res) => {
    try {
      const payment =
        await PaymentHistory.findOne({
          _id: req.params.id,

          userid:
            req.userid.toString(),
        });

      if (!payment) {
        return res.status(404).json({
          message:
            "Payment record not found",
        });
      }

      const user =
        await auth.findById(
          req.userid
        );

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${payment.invoiceNumber}.pdf`
      );

      const doc =
        new PDFDocument();

      doc.pipe(res);

      doc
        .fontSize(24)
        .text(
          "STACKOVERFLOW CLONE",
          {
            align: "center",
          }
        );

      doc.moveDown();

      doc
        .fontSize(18)
        .text(
          "Subscription Invoice"
        );

      doc.moveDown();

      doc.fontSize(12);

      doc.text(
        `Invoice Number: ${payment.invoiceNumber}`
      );

      doc.text(
        `Payment Date: ${payment.paymentDate.toDateString()}`
      );

      doc.text(
        `Customer Name: ${user?.name || ""}`
      );

      doc.text(
        `Customer Email: ${user?.email || ""}`
      );

      doc.moveDown();

      doc.text(
        `Plan: ${payment.plan}`
      );

      // Use INR instead of ₹ because
      // PDFKit default fonts may not support ₹.
      doc.text(
        `Amount: INR ${payment.amount}`
      );

      doc.text(
        `Payment ID: ${payment.razorpayPaymentId}`
      );

      doc.text(
        `Subscription ID: ${payment.razorpaySubscriptionId}`
      );

      doc.text(
        `Payment Status: ${payment.paymentStatus}`
      );

      doc.moveDown();

      doc.text(
        "Thank you for your subscription."
      );

      doc.end();

    } catch (error) {
      console.log(
        "Invoice error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to generate invoice",

        error:
          error.message,
      });
    }
  };

// =====================================================
// SEND INVOICE EMAIL
// =====================================================

const sendInvoiceEmail =
  async (user, payment) => {
    try {
      if (
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
      ) {
        console.log(
          "Email credentials not configured. Invoice email skipped."
        );

        return;
      }

      const transporter =
        nodemailer.createTransport({
          service: "gmail",

          auth: {
            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,
          },
        });

      const doc =
        new PDFDocument();

      const chunks = [];

      doc.on(
        "data",
        (chunk) =>
          chunks.push(chunk)
      );

      const pdfPromise =
        new Promise(
          (resolve) => {
            doc.on(
              "end",
              () =>
                resolve(
                  Buffer.concat(
                    chunks
                  )
                )
            );
          }
        );

      doc
        .fontSize(22)
        .text(
          "STACKOVERFLOW CLONE",
          {
            align: "center",
          }
        );

      doc.moveDown();

      doc
        .fontSize(18)
        .text(
          "Subscription Invoice"
        );

      doc.moveDown();

      doc
        .fontSize(12)
        .text(
          `Invoice Number: ${payment.invoiceNumber}`
        );

      doc.text(
        `Customer: ${user.name || ""}`
      );

      doc.text(
        `Email: ${user.email || ""}`
      );

      doc.text(
        `Plan: ${payment.plan}`
      );

      doc.text(
        `Amount: INR ${payment.amount}`
      );

      doc.text(
        `Payment ID: ${payment.razorpayPaymentId}`
      );

      doc.text(
        `Status: ${payment.paymentStatus}`
      );

      doc.end();

      const pdfBuffer =
        await pdfPromise;

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to:
          user.email,

        subject:
          `Subscription Activated - ${payment.plan}`,

        text:
          `Your ${payment.plan} subscription has been activated successfully.

Invoice Number: ${payment.invoiceNumber}
Amount: INR ${payment.amount}

Thank you.`,

        attachments: [
          {
            filename:
              `${payment.invoiceNumber}.pdf`,

            content:
              pdfBuffer,
          },
        ],
      });

      console.log(
        "Invoice email sent successfully"
      );

    } catch (error) {
      console.log(
        "Invoice email error:",
        error.message
      );
    }
  };

// =====================================================
// RAZORPAY WEBHOOK
// =====================================================

export const razorpayWebhook =
  async (req, res) => {
    try {
      // Demo mode doesn't need Razorpay webhook.
      if (
        process.env.DEMO_PAYMENT ===
        "true"
      ) {
        return res.status(200).json({
          message:
            "Demo payment mode - webhook skipped",
        });
      }

      const webhookSignature =
        req.headers[
          "x-razorpay-signature"
        ];

      const rawBody =
        req.rawBody;

      if (!rawBody) {
        return res.status(400).json({
          message:
            "Raw webhook body missing",
        });
      }

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_WEBHOOK_SECRET
          )
          .update(rawBody)
          .digest("hex");

      if (
        expectedSignature !==
        webhookSignature
      ) {
        return res.status(400).json({
          message:
            "Invalid webhook signature",
        });
      }

      const event =
        req.body;

      const eventName =
        event.event;

      const subscriptionEntity =
        event.payload?.subscription
          ?.entity;

      const razorpaySubscriptionId =
        subscriptionEntity?.id;

      if (
        !razorpaySubscriptionId
      ) {
        return res.status(200).json({
          message:
            "Webhook received",
        });
      }

      const subscription =
        await Subscription.findOne({
          razorpaySubscriptionId,
        });

      if (!subscription) {
        return res.status(200).json({
          message:
            "Subscription not found",
        });
      }

      const user =
        await auth.findById(
          subscription.userid
        );

      if (!user) {
        return res.status(200).json({
          message:
            "User not found",
        });
      }

      if (
        eventName ===
        "subscription.activated"
      ) {
        const now =
          new Date();

        const renewal =
          new Date(now);

        renewal.setMonth(
          renewal.getMonth() + 1
        );

        subscription.status =
          "active";

        subscription.startDate =
          subscription.startDate ||
          now;

        subscription.renewalDate =
          renewal;

        subscription.endDate =
          renewal;

        await subscription.save();

        user.subscriptionPlan =
          subscription.plan;

        user.subscriptionStatus =
          "active";

        user.razorpaySubscriptionId =
          razorpaySubscriptionId;

        user.renewalDate =
          renewal;

        await user.save();
      }

      if (
        eventName ===
        "subscription.pending"
      ) {
        subscription.status =
          "pending";

        await subscription.save();

        user.subscriptionStatus =
          "inactive";

        await user.save();
      }

      if (
        eventName ===
        "subscription.halted"
      ) {
        subscription.status =
          "halted";

        await subscription.save();

        user.subscriptionStatus =
          "expired";

        await user.save();
      }

      if (
        eventName ===
        "subscription.cancelled"
      ) {
        subscription.status =
          "cancelled";

        await subscription.save();

        user.subscriptionStatus =
          "cancelled";

        await user.save();
      }

      res.status(200).json({
        message:
          "Webhook processed successfully",
      });

    } catch (error) {
      console.log(
        "Webhook error:",
        error
      );

      res.status(500).json({
        message:
          "Webhook processing failed",
      });
    }
  };