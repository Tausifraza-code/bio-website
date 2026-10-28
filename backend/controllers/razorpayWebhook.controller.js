const crypto = require("crypto");
const PlanPurchase = require("../models/PlanPurchase");

const razorpayWebhook = async (req, res) => {
  console.log("RAZORPAY WEBHOOK RECEIVED");
  console.log(
    "Signature:",
    req.headers["x-razorpay-signature"] ? "Present" : "Missing",
  );
  console.log("Body is Buffer:", Buffer.isBuffer(req.body));

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !signature || !Buffer.isBuffer(req.body)) {
      return res.status(400).send("Invalid webhook configuration or body");
    }

    // Verify signature using the exact raw request body
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest();

    let receivedSignature;

    try {
      receivedSignature = Buffer.from(signature, "hex");
    } catch {
      return res.status(400).send("Invalid signature");
    }

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return res.status(400).send("Invalid webhook signature");
    }

    const event = JSON.parse(req.body.toString("utf8"));
    console.log("Webhook signature verified");
    console.log("Webhook event:", event.event);

    const payment = event.payload?.payment?.entity;

    if (!payment?.order_id || !payment?.id) {
      // Acknowledge unrelated event formats without modifying purchases.
      return res.status(200).json({ received: true });
    }

    if (event.event === "payment.captured") {
      if (
        payment.status !== "captured" ||
        payment.captured !== true ||
        payment.currency !== "INR"
      ) {
        return res.status(400).send("Payment details are invalid");
      }

      const amount = payment.amount;

      const purchase = await PlanPurchase.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (!purchase) {
        // Ask Razorpay to retry if the matching order is not found yet.
        return res.status(500).send("Purchase not found for order");
      }

      if (amount !== Math.round(purchase.amount * 100)) {
        return res.status(400).send("Payment amount mismatch");
      }

      // If already paid, acknowledge the duplicate without reprocessing.
      if (purchase.status === "paid") {
        return res.status(200).json({ received: true });
      }

      const now = new Date();
      const expiryDate = new Date(now);

      if (purchase.durationUnit === "days") {
        expiryDate.setDate(expiryDate.getDate() + purchase.durationValue);
      } else if (purchase.durationUnit === "months") {
        expiryDate.setMonth(expiryDate.getMonth() + purchase.durationValue);
      } else {
        expiryDate.setFullYear(
          expiryDate.getFullYear() + purchase.durationValue,
        );
      }

      // Allow a previously failed attempt to become paid if a later
      // captured event confirms the order was actually paid.
      const updated = await PlanPurchase.findOneAndUpdate(
        {
          _id: purchase._id,
          status: { $in: ["pending", "failed"] },
        },
        {
          $set: {
            status: "paid",
            razorpayPaymentId: payment.id,
            purchaseDate: now,
            expiryDate,
          },
        },
        { returnDocument: "after" },
      );

      if (!updated) {
        return res.status(200).json({ received: true });
      }
    } else if (event.event === "payment.failed") {
      // Failure applies to an individual payment attempt. Do not
      // downgrade a purchase that has already been paid.
      await PlanPurchase.updateOne(
        {
          razorpayOrderId: payment.order_id,
          status: "pending",
        },
        {
          $set: { status: "failed" },
        },
      );
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error.message);
    return res.status(500).send("Webhook processing failed");
  }
};

module.exports = { razorpayWebhook };
