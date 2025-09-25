## Frontend Integration Guide — Wedding Invitation API

This document explains how to integrate the Wedding Invitation API from a frontend app.

### Base URL
- Local development: `http://localhost:3000`
- Production: use your deployed server URL

### Endpoints
- POST `/api/bride/accept-invite` — Save a response to the bride sheet
- POST `/api/groom/accept-invite` — Save a response to the groom sheet
- POST `/api/accept-invite` — Legacy; same as bride endpoint
- GET `/health` — Health check

### Request format (POST)
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `name` (string, required)
  - `accepted` (boolean|string, optional; defaults to true if omitted). Accepts `true`, `false`, `'true'`, `'false'`.
  - `guestCount` (number|string, required when `accepted` is true)
  - `phone` (string, optional)
  - `message` (string, optional)

Notes:
- If `accepted` is omitted, it is treated as `true` and `guestCount` becomes required.
- Validation errors return HTTP 400.

### Success response (200)
```json
{
  "success": true,
  "message": "Bride invitation response saved successfully",
  "data": {
    "name": "Jane Doe",
    "accepted": "true",
    "guestCount": "2",
    "phone": "+1 555-1234",
    "message": "Looking forward!",
    "submittedAt": "2025-09-24T12:34:56.789Z"
  },
  "respondentType": "Bride"
}
```

When `accepted` is false, `guestCount` will be an empty string in the saved data.

### Error responses
- 400 — Missing required fields
```json
{ "error": "Missing required field: name" }
```
- 400 — `guestCount` required when accepted
```json
{ "error": "guestCount is required when accepted is true" }
```
- 500 — Server error
```json
{ "error": "Internal server error", "message": "Failed to save bride invitation response" }
```

### Frontend examples

#### Using fetch (browser / React)
```javascript
async function submitInvite({ baseUrl, target, payload }) {
  const endpointMap = {
    bride: "/api/bride/accept-invite",
    groom: "/api/groom/accept-invite",
    legacy: "/api/accept-invite"
  };
  const res = await fetch(`${baseUrl}${endpointMap[target]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

// Example usage
submitInvite({
  baseUrl: "http://localhost:3000",
  target: "bride",
  payload: {
    name: "Jane Doe",
    accepted: true,
    guestCount: 2,
    phone: "+1 555-1234",
    message: "Looking forward!"
  }
})
  .then(console.log)
  .catch(console.error);
```

#### Using Axios
```javascript
import axios from "axios";

async function submitInviteAxios(baseUrl, target, payload) {
  const endpointMap = {
    bride: "/api/bride/accept-invite",
    groom: "/api/groom/accept-invite",
    legacy: "/api/accept-invite"
  };
  const url = `${baseUrl}${endpointMap[target]}`;
  const { data } = await axios.post(url, payload, {
    headers: { "Content-Type": "application/json" }
  });
  return data;
}
```

#### curl (for quick testing)
```bash
curl -X POST http://localhost:3000/api/bride/accept-invite \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "accepted": true,
    "guestCount": 2,
    "phone": "+1 555-1234",
    "message": "Looking forward!"
  }'
```

### Health check
```bash
curl http://localhost:3000/health
```
Response:
```json
{
  "status": "OK",
  "message": "Wedding invitation server is running",
  "timestamp": "2025-09-24T12:34:56.789Z"
}
```

### CORS
The server enables CORS by default. If your frontend is on a different origin, requests should work without additional configuration. If you need to restrict origins, adjust the CORS setup in `server.js`.

### Field handling details
- `accepted` is normalized: string values `'true'`/`'false'` or booleans are accepted.
- When `accepted` is `false`, `guestCount` is ignored and stored as an empty string.
- A server-side `submittedAt` timestamp is added automatically.

### Environment variables (server-side)
- `GOOGLE_SPREADSHEET_ID`
- `GOOGLE_BRIDE_SHEET_NAME` (default: `bride`)
- `GOOGLE_GROOM_SHEET_NAME` (default: `groom`)
- `PORT` (default: `3000`)

No frontend configuration is required for these; they are used by the server.


