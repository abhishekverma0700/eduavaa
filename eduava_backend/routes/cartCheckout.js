import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../db.js";

const router = express.Router();

/* ---------------- RAZORPAY INSTANCE ---------------- */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Normalize and validate cart items up front so we can reuse across endpoints.
const sanitizeItems = (items) =>
  (items || []).map((item) => ({
    pdfKey: item?.pdfKey,
    price: Number(item?.price ?? 0),
  }));

const validateCartRequest = (userId, items) => {
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return "Invalid request: userId and non-empty items array required";
  }

  const normalized = sanitizeItems(items);
  for (const item of normalized) {
    if (!item.pdfKey || typeof item.pdfKey !== "string") {
      return "Invalid item: pdfKey required for all items";
    }
    if (!Number.isFinite(item.price) || item.price <= 0) {
      return "Invalid item: positive price required for all items";
    }
  }

  return null;
};

/* ---------------- CART CHECKOUT ---------------- */
/**
 * POST /api/cart/checkout
 * 
 * Request body:
 * {
 *   "userId": "string",
 *   "userName": "string",
 *   "userEmail": "string",
 *   "items": [
 *     { "pdfKey": "Notes/unit1.pdf", "price": 4.5 },
 *     { "pdfKey": "Quantum/q1.pdf", "price": 16.5 }
 *   ]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "order": { razorpay order object },
 *   "totalAmount": 21,
 *   "itemCount": 2
 * }
 */
router.post("/checkout", async (req, res) => {
  try {
    const { userId, userName, userEmail, items } = req.body;

    const validationError = validateCartRequest(userId, items);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    const normalizedItems = sanitizeItems(items);

    // Calculate total amount from items (cast to Number to match spec)
    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    // Create Razorpay order using existing logic
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `eduava_cart_${Date.now()}`,
      notes: {
        type: "cart",
        itemCount: items.length,
        userId: userId,
      }
    });

    console.log(
      `📦 Cart order created: ${order.id} for ${normalizedItems.length} items, total ₹${totalAmount}`
    );
    console.log(
      `🔍 Cart order details -> user: ${userId}, email: ${userEmail || "-"}, items: ${normalizedItems
        .map((i) => i.pdfKey)
        .join(", ")}`
    );

    // Return order details to frontend
    res.json({
      success: true,
      order: order,
      totalAmount: totalAmount,
      itemCount: normalizedItems.length,
      items: normalizedItems.map((item) => item.pdfKey), // Return PDF keys for reference
    });

  } catch (err) {
    console.error("❌ Cart checkout error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create cart checkout order" 
    });
  }
});

/* ---------------- CART PAYMENT VERIFICATION ---------------- */
/**
 * POST /api/cart/verify-payment
 * 
 * Verifies Razorpay payment and unlocks all PDFs in the cart
 * 
 * Request body:
 * {
 *   "razorpay_payment_id": "string",
 *   "razorpay_order_id": "string",
 *   "razorpay_signature": "string",
 *   "userId": "string",
 *   "userName": "string",
 *   "userEmail": "string",
 *   "items": [
 *     { "pdfKey": "Notes/unit1.pdf", "price": 4.5 },
 *     { "pdfKey": "Quantum/q1.pdf", "price": 16.5 }
 *   ]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "unlockedPaths": ["Notes/unit1.pdf", "Quantum/q1.pdf"],
 *   "unlockCount": 2
 * }
 */
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      userName,
      userEmail,
      items,
    } = req.body;

    // Validation
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing payment verification parameters" 
      });
    }

    const validationError = validateCartRequest(userId, items);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    const normalizedItems = sanitizeItems(items);

    // Verify Razorpay signature using existing logic
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Cart payment signature mismatch");
      return res.status(402).json({ 
        success: false, 
        error: "Payment verification failed" 
      });
    }

    console.log(`✅ Cart payment verified: ${razorpay_payment_id}`);
    console.log(
      `🔓 Unlocking cart items -> user: ${userId}, items: ${normalizedItems
        .map((i) => i.pdfKey)
        .join(", ")}`
    );

    // Save user (reusing existing logic)
    await pool.query(
      `INSERT INTO users (id, name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [userId, userName || "Student", userEmail || ""]
    );

    // Extract PDF paths from items
    const pathsToUnlock = normalizedItems.map((item) => item.pdfKey);

    // Unlock each PDF (reusing existing unlock logic)
    const unlockedPaths = [];
    for (const path of pathsToUnlock) {
      try {
        await pool.query(
          `INSERT INTO unlocks (user_id, note_path, payment_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, note_path) DO NOTHING`,
          [userId, path, razorpay_payment_id]
        );
        unlockedPaths.push(path);
      } catch (unlockErr) {
        console.error(`⚠️ Failed to unlock ${path}:`, unlockErr);
        // Continue with other PDFs even if one fails
      }
    }

    console.log(`✅ Unlocked ${unlockedPaths.length} PDFs from cart for user ${userId}`);

    res.json({ 
      success: true,
      unlocked: unlockedPaths,
      unlockedPaths: unlockedPaths, // kept for backward compatibility with docs
      unlockCount: unlockedPaths.length,
    });

  } catch (err) {
    console.error("❌ Cart verify payment error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to verify cart payment",
    });
  }
});

export default router;
