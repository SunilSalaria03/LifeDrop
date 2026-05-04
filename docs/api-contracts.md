# LifeDrop API Contracts

## Base URL
Backend APIs are served under:

```text
/api/v1
```

## Current Contracts
### Auth Health

```http
GET /api/v1/auth/health
```

Response:

```json
{
  "success": true,
  "data": {
    "module": "auth",
    "status": "ready"
  },
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/health"
}
```

## Planned Contracts
- Auth registration and login
- User profile onboarding
- Donor profile creation and update
- Blood request creation and lifecycle updates
- Nearby donor search
- Notification-ready emergency events
- Admin-ready management endpoints
