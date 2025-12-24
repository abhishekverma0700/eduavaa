import { Note } from "@/types";
import { User } from "firebase/auth";

interface PaymentOptions {
  amount: number;
  note: Note;
  user: User;
  onSuccess: () => void;
  onFailure: () => void;
}

// Track ongoing payments to prevent double clicks
let isPaymentInProgress = false;

export const isRazorpaySDKLoaded = (): boolean => {
  return typeof (window as any).Razorpay !== "undefined";
};

/**
 * Wait for Razorpay SDK to load (from index.html script tag)
 * with timeout to prevent hanging
 */
const waitForRazorpaySDK = async (timeoutMs: number = 5000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (isRazorpaySDKLoaded()) {
      console.log("✅ Razorpay SDK loaded");
      return true;
    }
    // Wait 100ms before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.error("❌ Razorpay SDK timeout");
  return false;
};

export const startPayment = async ({
  amount,
  note,
  user,
  onSuccess,
  onFailure,
}: PaymentOptions) => {
  try {
    // 🔴 STEP 0: Entry log
    console.log("🚀 startPayment called");
    console.log("amount:", amount);
    console.log("note:", note);
    console.log("user:", user.uid);

    // 🔴 STEP 0.5: Prevent double clicks
    if (isPaymentInProgress) {
      console.warn("⚠️ Payment already in progress");
      return;
    }

    // Mark payment as in progress early
    isPaymentInProgress = true;

    // 🔴 STEP 1: Wait for Razorpay SDK to load
    const sdkReady = await waitForRazorpaySDK();
    if (!sdkReady) {
      console.error("❌ Razorpay SDK not available");
      isPaymentInProgress = false;
      onFailure();
      return;
    }
    console.log("✅ Razorpay SDK ready");

    // 🔴 STEP 2: Create order (backend)
    console.log("➡️ Calling backend /create-order");

    const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    console.log("⬅️ Backend status:", orderRes.status);

    if (!orderRes.ok) {
      console.error("❌ Order create failed");
      isPaymentInProgress = false;
      onFailure();
      return;
    }

    const order = await orderRes.json();
    console.log("✅ Order created:", order);

    // Small delay to ensure order is fully processed
    await new Promise(resolve => setTimeout(resolve, 100));

    // 🔴 STEP 3: Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Eduava",
      description: note.label,
      order_id: order.id,
      redirect: false, // keep checkout in the same modal on mobile

      handler: async (response: any) => {
        try {
          console.log("✅ Payment success from Razorpay:", response);

          console.log("➡️ Verifying payment with backend");

          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                notePath: note.r2Path,
              }),
            }
          );

          const data = await verifyRes.json();
          console.log("⬅️ Verify response:", data);

          if (data.success) {
            console.log("🎉 Payment verified & unlocked");
            isPaymentInProgress = false;
            onSuccess();
          } else {
            console.error("❌ Verification failed");
            isPaymentInProgress = false;
            onFailure();
          }
        } catch (err) {
          console.error("❌ Verify exception:", err);
          isPaymentInProgress = false;
          onFailure();
        }
      },

      modal: {
        ondismiss: () => {
          console.warn("⚠️ Razorpay popup dismissed by user");
          isPaymentInProgress = false;
          onFailure();
        },
      },

      theme: { color: "#6366f1" },
    };

    console.log("🧾 Razorpay options:", options);

    // 🔴 STEP 4: Open Razorpay popup
    // Double-check SDK is still available before creating instance
    if (!isRazorpaySDKLoaded()) {
      console.error("❌ Razorpay SDK disappeared");
      isPaymentInProgress = false;
      onFailure();
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    
    // Ensure Razorpay instance is ready before opening
    if (typeof rzp.open !== "function") {
      console.error("❌ Razorpay instance invalid");
      isPaymentInProgress = false;
      onFailure();
      return;
    }

    rzp.open();

    console.log("🟢 Razorpay popup opened");
  } catch (err) {
    console.error("❌ startPayment crashed:", err);
    isPaymentInProgress = false;
    onFailure();
  }
};
