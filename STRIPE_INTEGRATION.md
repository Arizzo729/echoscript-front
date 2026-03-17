# Stripe Payment Gateway Integration Guide

## Overview
This guide documents the Stripe payment gateway integration for EchoScript.AI, including cart checkout for extra minutes purchases.

## Configuration

### Environment Variables (in `.env`)
```
STRIPE_SECRET_KEY=sk_live_... # Your Stripe secret key
STRIPE_PRICE_PRO=price_... # Stripe price ID for Pro plan
STRIPE_PRICE_PREMIUM=price_... # Stripe price ID for Premium plan
STRIPE_PRICE_EDU=price_... # Stripe price ID for Edu plan
FRONTEND_URL=http://localhost:5000 # Frontend base URL
```

All variables are already configured in the `.env` file.

## Features Implemented

### 1. Extra Minutes Cart Checkout
**File**: `src/pages/BuyExtraMinutes.jsx`

Users can:
- Add minute bundles to cart
- View cart total
- Proceed to secure Stripe Checkout
- Option to gift minutes to another user

**Features**:
- ✓ Add/remove items from cart
- ✓ Adjust quantities
- ✓ View total minutes and cost
- ✓ Gift option with recipient email
- ✓ Loading states during checkout
- ✓ Error handling and user feedback

### 2. Backend Stripe Endpoints
**File**: `echoscript-backend/app/routes/stripe_checkout.py`

#### POST `/api/stripe/checkout/create`
Creates a Stripe Checkout session for:
- **Standard Plans** (by plan name or price_id)
- **Extra Minutes** (from cart with custom amount)

**Request Body Example** (Extra Minutes):
```json
{
  "mode": "payment",
  "metadata": {
    "type": "extra_minutes",
    "items": "[{\"bundle_id\": 1, \"quantity\": 1, \"minutes\": 5, \"price\": 0.99}, ...]",
    "is_gift": false,
    "recipient_email": ""
  }
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/...",
  "id": "cs_live_..."
}
```

#### GET `/api/stripe/checkout/session`
Retrieves checkout session details by session ID.

**Query Parameters**:
- `session_id`: Stripe session ID

**Response**:
```json
{
  "id": "cs_live_...",
  "status": "complete",
  "payment_status": "paid"
}
```

### 3. Payment Success Flow
**File**: `src/pages/ReceiptPage.jsx`

When payment is successful:
1. User redirected to `/thank-you` with `session_id` query parameter
2. Success page displayed with confirmation
3. Auto-redirect to account dashboard after 7 seconds
4. User can manually navigate to dashboard

### 4. Frontend Packages
```
@stripe/react-stripe-js
stripe
```

These packages are installed and ready for advanced Stripe integration (e.g., custom payment elements).

## Testing

### Test Stripe Checkout Session Creation
```bash
python test_stripe_checkout.py
```

This test script:
1. Creates a test user
2. Creates a checkout session for cart items
3. Creates a checkout session with gift option
4. Verifies Stripe URLs are returned

### Manual Testing Flow

1. **Start Frontend & Backend**:
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd echoscript-backend
   python asgi_dev.py
   ```

2. **Test Cart Checkout**:
   - Navigate to `/purchase/minutes`
   - Add bundles to cart
   - Click "Checkout"
   - Should redirect to Stripe Checkout

3. **Use Stripe Test Card**:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `567`

## Implementation Details

### Database Considerations
The current implementation:
- Stores `type: "extra_minutes"` in metadata
- Stores items array (JSON stringified) in metadata
- Stores gift info and recipient email in metadata
- Stores total_minutes for display/logging

### TODO: Webhook Handling
Not yet implemented:
- Stripe webhook to update user minutes after payment
- Receipt/order storage in database
- Email confirmation to user with purchase details
- Gift notification to recipient

### TODO: Thank-You Page Enhancement
The ReceiptPage could be enhanced to:
- Display order summary with amount paid
- Show extra minutes added to account
- Provide download receipt option
- Track purchase in order history

## Troubleshooting

### "Stripe secret key is not configured"
- Check `.env` file has `STRIPE_SECRET_KEY` set
- Verify backend has reloaded configuration
- Check `FRONTEND_URL` is also set for success/cancel URLs

### Checkout URL not returned
- Check items array is properly formatted
- Verify total_cents > 0
- Check Stripe API response in backend logs

### Payment redirect not working
- Verify `/thank-you` route exists in App.jsx
- Check FRONTEND_URL matches your actual frontend domain
- Verify browser allows redirects

## Next Steps

1. **Webhook Integration**: Implement Stripe webhooks to update user balance after successful payment
2. **Order History**: Store orders in database before checkout
3. **Email Receipts**: Send confirmation emails to user and recipient (if gift)
4. **Payment Methods**: Add support for Apple Pay, Google Pay
5. **Subscription Plans**: Implement recurring subscription checkout
