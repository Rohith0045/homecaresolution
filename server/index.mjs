import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

console.log("Initializing Razorpay with Key ID:", process.env.RAZORPAY_KEY_ID ? "Found" : "Missing");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    
    console.log("Incoming order request:", { amount, currency, receipt });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("CRITICAL: Razorpay API keys are missing in the environment!");
      return res.status(500).json({ error: "Server configuration error: Missing API keys" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });
    
    console.log("Order created successfully:", order.id);
    res.json(order);
  } catch (error) {
    console.error("Razorpay API Error:", error);
    res.status(500).json({ 
      error: "Failed to create Razorpay order",
      details: error.description || error.message || "Unknown error"
    });
  }
});

app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return res.json({ ok: true });
  }

  return res.status(400).json({ ok: false, message: "Invalid signature" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Razorpay server listening on http://localhost:${PORT}`);
});
