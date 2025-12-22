import { Note } from "@/types";
import { User } from "firebase/auth";

interface PaymentOptions {
  amount: number;
  note: Note;
  user: User;
  onSuccess: () => void;
  onFailure: () => void;
}

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

    // 🔴 STEP 1: Razorpay SDK check
    if (!(window as any).Razorpay) {
      console.error("❌ Razorpay SDK not loaded");
      alert("Razorpay SDK not loaded");
      onFailure();
      return;
    }
    console.log("✅ Razorpay SDK found");

    // 🔴 STEP 2: Create order (backend)
    console.log("➡️ Calling backend /create-order");

    const orderRes = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    console.log("⬅️ Backend status:", orderRes.status);

    if (!orderRes.ok) {
      console.error("❌ Order create failed");
      onFailure();
      return;
    }

    const order = await orderRes.json();
    console.log("✅ Order created:", order);

    // 🔴 STEP 3: Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Eduava",
      description: note.label,
      order_id: order.id,

      handler: async (response: any) => {
        try {
          console.log("✅ Payment success from Razorpay:", response);

          console.log("➡️ Verifying payment with backend");

          const verifyRes = await fetch(
            "http://localhost:5000/verify-payment",
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
            onSuccess();
          } else {
            console.error("❌ Verification failed");
            onFailure();
          }
        } catch (err) {
          console.error("❌ Verify exception:", err);
          onFailure();
        }
      },

      modal: {
        ondismiss: () => {
          console.warn("⚠️ Razorpay popup dismissed by user");
          onFailure();
        },
      },

      theme: { color: "#6366f1" },
    };

    console.log("🧾 Razorpay options:", options);

    // 🔴 STEP 4: Open Razorpay popup
    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    console.log("🟢 Razorpay popup opened");
  } catch (err) {
    console.error("❌ startPayment crashed:", err);
    onFailure();
  }
};
