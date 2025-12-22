import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Backend file loaded");

/* -------------------- ADMIN UID (LOCK) -------------------- */
const ADMIN_UIDS = [
  "ywgsU3BOAnONQSCg05rk0dL4Ajv2" // 👈 TERA UID (FINAL)
];

/* -------------------- RAZORPAY -------------------- */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

/* -------------------- CREATE ORDER -------------------- */
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount missing" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "eduava_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false });
  }
});

/* -------------------- VERIFY + UNLOCK -------------------- */
app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      notePath,
      userName,
      userEmail,
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !userId ||
      !notePath
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    /* ---------- SAVE USER ---------- */
    db.prepare(`
      INSERT OR IGNORE INTO users (id, name, email)
      VALUES (?, ?, ?)
    `).run(userId, userName || "Student", userEmail || "");

    /* ---------- SAVE UNLOCK ---------- */
    db.prepare(`
      INSERT OR IGNORE INTO unlocks (user_id, note_path, payment_id)
      VALUES (?, ?, ?)
    `).run(userId, notePath, razorpay_payment_id);

    res.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false });
  }
});

/* -------------------- USER UNLOCKS -------------------- */
app.get("/user-unlocks/:userId", (req, res) => {
  const rows = db
    .prepare(`SELECT note_path FROM unlocks WHERE user_id = ?`)
    .all(req.params.userId);

  res.json({
    unlockedNotes: rows.map(r => r.note_path),
  });
});

/* -------------------- ADMIN : SALES (UID LOCKED) -------------------- */
app.get("/admin/sales", (req, res) => {
  const adminUid = req.headers["x-admin-uid"];

  if (!ADMIN_UIDS.includes(adminUid)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const rows = db.prepare(`
    SELECT 
      u.name,
      u.email,
      un.note_path,
      un.payment_id,
      un.created_at
    FROM unlocks un
    JOIN users u ON u.id = un.user_id
    ORDER BY un.created_at DESC
  `).all();

  res.json({ sales: rows });
});

/* -------------------- START SERVER -------------------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
