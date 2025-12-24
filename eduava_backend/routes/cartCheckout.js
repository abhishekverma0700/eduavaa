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

    // Validation
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid request: userId and items array required" 
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.pdfKey || typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid item: pdfKey and valid price required for all items" 
        });
      }
    }

    // Calculate total amount from items
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

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

    console.log(`📦 Cart order created: ${order.id} for ${items.length} items, total ₹${totalAmount}`);

    // Return order details to frontend
    res.json({
      success: true,
      order: order,
      totalAmount: totalAmount,
      itemCount: items.length,
      items: items.map(item => item.pdfKey), // Return PDF keys for reference
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

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid request: userId and items array required" 
      });
    }

    // Verify Razorpay signature using existing logic
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Cart payment signature mismatch");
      return res.status(400).json({ 
        success: false, 
        error: "Payment verification failed" 
      });
    }

    console.log(`✅ Cart payment verified: ${razorpay_payment_id}`);

    // Save user (reusing existing logic)
    await pool.query(
      `INSERT INTO users (id, name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [userId, userName || "Student", userEmail || ""]
    );

    // Extract PDF paths from items
    const pathsToUnlock = items.map(item => item.pdfKey);

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
      unlockedPaths: unlockedPaths,
      unlockCount: unlockedPaths.length,
    });

  } catch (err) {
    console.error("❌ Cart verify payment error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to verify cart payment" 
    });
  }
});

export default router;
