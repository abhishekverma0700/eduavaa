import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import pool from "./db.js";
import cartCheckoutRoutes from "./routes/cartCheckout.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Backend file loaded");

/* ---------------- ADMIN UID ---------------- */
const ADMIN_UIDS = [
  "ywgsU3BOAnONQSCg05rk0dL4Ajv2", // legacy admin
  "ixvHHm1c9Qh3ZrrCn8j20tl4DYb2", // web admin (frontend const)
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

/* ---------------- CART ROUTES (NEW) ---------------- */
app.use("/api/cart", cartCheckoutRoutes);

/* ---------------- CREATE ORDER ---------------- */
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.warn("❌ Invalid amount provided:", amount);
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "eduava_" + Date.now(),
    });

    if (!order || !order.id) {
      console.error("❌ Failed to create order - no order ID returned");
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    console.log(`✅ Order created: ${order.id} for amount ₹${amount}`);
    res.json(order);
  } catch (err) {
    console.error("❌ Order creation error:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again.",
    });
  }
});

/* ---------------- VERIFY + UNLOCK (BULK SUPPORT) WITH ERROR HANDLING -------- */
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

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId) {
      console.warn("❌ Missing payment fields", { userId });
      return res.status(400).json({
        success: false,
        message: "Missing payment information",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch for payment", { razorpay_payment_id });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Save or update user (non-critical, continue if fails)
    try {
      await pool.query(
        `INSERT INTO users (id, name, email)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET
           name = COALESCE($2, users.name),
           email = COALESCE($3, users.email)`,
        [userId, userName || "Student", userEmail || ""]
      );
    } catch (userErr) {
      console.error("⚠️ User save error (continuing):", userErr.message);
      // Don't fail payment if user save fails
    }

    /* DETERMINE PATHS TO UNLOCK */
    const pathsToUnlock =
      notePaths && Array.isArray(notePaths) && notePaths.length > 0
        ? notePaths
        : notePath
        ? [notePath]
        : [];

    if (pathsToUnlock.length === 0) {
      console.error("❌ No PDF paths to unlock", { userId, razorpay_payment_id });
      return res.status(400).json({
        success: false,
        message: "No PDFs to unlock",
      });
    }

    /* SAVE UNLOCKS (BULK) WITH ERROR HANDLING PER PATH */
    let unlockCount = 0;
    for (const path of pathsToUnlock) {
      try {
        await pool.query(
          `INSERT INTO unlocks (user_id, note_path, payment_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, note_path) DO NOTHING`,
          [userId, path, razorpay_payment_id]
        );
        unlockCount++;
      } catch (pathErr) {
        console.error("⚠️ Failed to unlock path:", path, pathErr.message);
        // Continue unlocking other paths even if one fails
      }
    }

    if (unlockCount === 0) {
      console.error("❌ Failed to unlock any PDFs", { userId });
      return res.status(500).json({
        success: false,
        message: "Failed to unlock PDFs",
      });
    }

    console.log(
      `✅ Payment verified. Unlocked ${unlockCount} of ${pathsToUnlock.length} PDFs for user ${userId}`
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Verify payment error:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed. Please contact support.",
    });
  }
});

/* ---------------- USER UNLOCKS (SAFE DEFAULTS) ---------------- */
app.get("/user-unlocks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      console.warn("❌ Invalid userId", { userId });
      return res.json({ unlockedNotes: [] }); // Safe default
    }

    const result = await pool.query(
      "SELECT note_path FROM unlocks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // Defensive: always return array, even if empty
    const unlockedNotes = result.rows
      ? result.rows.map((r) => r.note_path).filter((path) => path) // Filter out null values
      : [];

    console.log(`✅ Fetched ${unlockedNotes.length} unlocked PDFs for user ${userId}`);
    res.json({ unlockedNotes });
  } catch (err) {
    console.error("❌ User unlocks fetch error:", err.message || err);
    // Return empty array instead of error - keeps app functional
    res.json({ unlockedNotes: [] });
  }
});

/* ---------------- ADMIN SALES (WITH AUTH & ERROR HANDLING) ---------------- */
app.get("/admin/sales", async (req, res) => {
  try {
    const adminUid = req.headers["x-admin-uid"];

    // Validate admin UID
    if (!adminUid || !ADMIN_UIDS.includes(adminUid)) {
      console.warn("🚫 Unauthorized admin access attempt", { adminUid });
      return res.status(403).json({
        error: "Unauthorized",
        sales: [],
      });
    }

    const result = await pool.query(`
      SELECT 
        u.name,
        u.email,
        un.note_path,
        un.payment_id,
        un.created_at
      FROM unlocks un
      LEFT JOIN users u ON u.id = un.user_id
      ORDER BY un.created_at DESC
      LIMIT 1000
    `);

    const sales = result.rows || [];
    console.log(`✅ Admin sales report generated: ${sales.length} records`);
    res.json({ sales });
  } catch (err) {
    console.error("❌ Admin sales fetch error:", err.message || err);
    res.status(500).json({
      error: "Failed to fetch sales data",
      sales: [],
    });
  }
});

/* ---------------- 404 Handler & Global Error Handler -------- */
app.use((req, res) => {
  console.warn("🚫 Route not found", { method: req.method, path: req.path });
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Global error handler (catch-all)
app.use((err, req, res, next) => {
  console.error("❌ Uncaught error:", err.message || err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
