const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;

    if (!key_id || !key_secret) {
      return res.status(500).json({ error: "Server configuration error: Missing API keys" });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to create Razorpay order",
      details: error.message || "Unknown error"
    });
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;

  if (!key_secret) {
    return res.status(500).json({ error: "Server configuration error: Missing API keys" });
  }

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return res.json({ ok: true });
  }

  return res.status(400).json({ ok: false, message: "Invalid signature" });
});

exports.api = functions.https.onRequest(app);
