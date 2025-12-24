import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Backend file loaded");

/* ---------------- ADMIN UID ---------------- */
const ADMIN_UIDS = [
  "ywgsU3BOAnONQSCg05rk0dL4Ajv2"
];

/* ---------------- RAZORPAY ---------------- */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ---------------- HEALTH ---------------- */
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

/* ---------------- CREATE ORDER ---------------- */
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ success: false });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "eduava_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ---------------- VERIFY + UNLOCK (BULK SUPPORT) ---------------- */
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      notePath,
      notePaths,
      userName,
      userEmail,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ success: false });
    }

    /* SAVE USER */
    await pool.query(
      `INSERT INTO users (id, name, email)
       VALUES ($1,$2,$3)
       ON CONFLICT (id) DO NOTHING`,
      [userId, userName || "Student", userEmail || ""]
    );

    /* DETERMINE PATHS TO UNLOCK */
    const pathsToUnlock = notePaths && Array.isArray(notePaths) ? notePaths : (notePath ? [notePath] : []);

    if (pathsToUnlock.length === 0) {
      console.error("❌ No paths to unlock");
      return res.status(400).json({ success: false });
    }

    /* SAVE UNLOCKS (BULK) */
    for (const path of pathsToUnlock) {
      await pool.query(
        `INSERT INTO unlocks (user_id, note_path, payment_id)
         VALUES ($1,$2,$3)
         ON CONFLICT (user_id, note_path) DO NOTHING`,
        [userId, path, razorpay_payment_id]
      );
    }

    console.log(`✅ Unlocked ${pathsToUnlock.length} PDFs for user ${userId}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false });
  }
});

/* ---------------- USER UNLOCKS ---------------- */
app.get("/user-unlocks/:userId", async (req, res) => {
  const result = await pool.query(
    "SELECT note_path FROM unlocks WHERE user_id = $1",
    [req.params.userId]
  );

  res.json({
    unlockedNotes: result.rows.map(r => r.note_path),
  });
});

/* ---------------- ADMIN SALES ---------------- */
app.get("/admin/sales", async (req, res) => {
  const adminUid = req.headers["x-admin-uid"];
  if (!ADMIN_UIDS.includes(adminUid)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const result = await pool.query(`
    SELECT 
      u.name,
      u.email,
      un.note_path,
      un.payment_id,
      un.created_at
    FROM unlocks un
    JOIN users u ON u.id = un.user_id
    ORDER BY un.created_at DESC
  `);

  res.json({ sales: result.rows });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
