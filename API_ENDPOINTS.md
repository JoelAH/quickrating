# API Endpoints

This document describes the external API endpoints that can be accessed from outside the application.

## GET /api/get-all-users

Retrieves a list of all users with their custom links and last update timestamps.

**Method:** POST

**Authentication:** Requires a secret key in the request body

**Request Body:**
```json
{
  "key": "next"
}
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "customLink": "businessname",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Notes:**
- Returns a maximum of 100 users
- Only returns `customLink` and `updatedAt` fields

---

## POST /api/payment-hook

Webhook endpoint for Lemon Squeezy payment notifications.

**Method:** POST

**Authentication:** Verified via X-Signature header using HMAC SHA256

**Headers:**
- `X-Signature`: HMAC signature for webhook verification

**Request Body:** Lemon Squeezy webhook payload

**Response:**
```json
{
  "message": "success"
}
```

**Notes:**
- Automatically creates or updates payment records
- Removes temporary payment records after successful processing
- Signature verification ensures requests come from Lemon Squeezy

---

## GET /api/payment-redirect

Redirect endpoint after successful payment checkout.

**Method:** GET

**Query Parameters:**
- `code`: Temporary verification code
- `id`: User ID
- `time`: Timestamp of the request

**Response:** Redirects to dashboard

**Notes:**
- Updates temporary payment records if request is within 2 minutes
- Always redirects to the dashboard URL
- Configured via `DASHBOARD_URL` environment variable

---

## Environment Variables

These endpoints require the following environment variables:

- `DB_URI`: MongoDB connection string
- `LS_WEBHOOK_SIG`: Lemon Squeezy webhook signature secret
- `DASHBOARD_URL`: URL to redirect users after payment (optional, defaults to production URL)
