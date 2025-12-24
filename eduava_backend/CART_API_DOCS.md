# Cart Checkout API Documentation

## 🛒 New Cart Endpoints

### 1. Create Cart Checkout Order

**Endpoint:** `POST /api/cart/checkout`

**Description:** Creates a Razorpay order for multiple PDFs in the cart

**Request Body:**
```json
{
  "userId": "firebase_user_id",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "items": [
    {
      "pdfKey": "cs/data-structures/unit-1/notes.pdf",
      "price": 4.5
    },
    {
      "pdfKey": "cs/algorithms/quantum/quantum.pdf",
      "price": 16.5
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 2100,
    "currency": "INR",
    "receipt": "eduava_cart_1234567890"
  },
  "totalAmount": 21,
  "itemCount": 2,
  "items": [
    "cs/data-structures/unit-1/notes.pdf",
    "cs/algorithms/quantum/quantum.pdf"
  ]
}
```

---

### 2. Verify Cart Payment

**Endpoint:** `POST /api/cart/verify-payment`

**Description:** Verifies Razorpay payment and unlocks all PDFs in the cart

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "userId": "firebase_user_id",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "items": [
    {
      "pdfKey": "cs/data-structures/unit-1/notes.pdf",
      "price": 4.5
    },
    {
      "pdfKey": "cs/algorithms/quantum/quantum.pdf",
      "price": 16.5
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "unlockedPaths": [
    "cs/data-structures/unit-1/notes.pdf",
    "cs/algorithms/quantum/quantum.pdf"
  ],
  "unlockCount": 2
}
```

---

## ✅ Implementation Details

### What Was Added:

1. **New Route File:** `routes/cartCheckout.js`
   - Contains cart checkout logic
   - Reuses existing Razorpay instance
   - Reuses existing database pool

2. **Route Registration:** Updated `index.js`
   - Added import for cart routes
   - Mounted routes at `/api/cart`
   - Did NOT modify existing routes

### Safety Features:

✅ **Validation:**
- Checks userId, items array, and prices
- Validates Razorpay signature
- Validates each item has pdfKey and price

✅ **Error Handling:**
- Try-catch blocks on all operations
- Continues unlocking even if one PDF fails
- Returns detailed error messages

✅ **Reuses Existing Logic:**
- Uses existing Razorpay configuration
- Uses existing database pool and queries
- Uses existing user save logic
- Uses existing unlock logic

✅ **Backward Compatible:**
- Old single-PDF routes unchanged
- No database schema changes
- No breaking changes

---

## 🧪 Testing (Before Deploying)

### Test 1: Create Cart Order
```bash
curl -X POST http://localhost:5000/api/cart/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "userName": "Test User",
    "userEmail": "test@example.com",
    "items": [
      {"pdfKey": "test/unit1.pdf", "price": 4.5},
      {"pdfKey": "test/quantum.pdf", "price": 16.5}
    ]
  }'
```

### Test 2: Verify Payment (After Razorpay Payment)
```bash
curl -X POST http://localhost:5000/api/cart/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_order_id": "order_xxxxx",
    "razorpay_signature": "signature_xxxxx",
    "userId": "test_user_123",
    "userName": "Test User",
    "userEmail": "test@example.com",
    "items": [
      {"pdfKey": "test/unit1.pdf", "price": 4.5},
      {"pdfKey": "test/quantum.pdf", "price": 16.5}
    ]
  }'
```

---

## 📝 Next Steps

1. ✅ Test locally with Postman/curl
2. ✅ Integrate with frontend cart page
3. ✅ Test Razorpay payment flow
4. ✅ Verify PDFs unlock correctly
5. ✅ Deploy to Render when ready

---

## ⚠️ Important Notes

- **NOT COMMITTED YET** - Code is ready but not deployed
- **SAFE FOR AUTO-DEPLOY** - No breaking changes
- **REUSES EXISTING LOGIC** - Minimal new code
- **DATABASE UNCHANGED** - No schema modifications
- **BACKWARD COMPATIBLE** - Old routes still work

