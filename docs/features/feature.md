# LifeDrop – Blood Donation Platform

## Overview

LifeDrop is a full-stack blood donation platform built to connect blood donors and blood requesters quickly during emergencies.

The application supports:

* Donor registration
* Blood search by location and blood group
* User authentication
* Phone OTP verification
* Google login
* WhatsApp & SMS emergency alerts
* Profile management
* Donor onboarding
* Real-time emergency communication
* End-to-end testing using Playwright

---

# Tech Stack

## Frontend

* React + Vite
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod Validation
* TanStack Query
* Axios
* Sonner Toast
* Playwright

## Backend

* NestJS
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Twilio
* Google OAuth
* REST APIs

## Deployment

* AWS EC2
* Nginx
* PM2
* GitHub

---

# Core Features

## 1. Authentication System

### Implemented Features

* User Signup
* User Login
* JWT Authentication
* Guest User Support
* Logout Functionality
* Google Login
* Phone OTP Verification
* Protected Routes

### Authentication Flow

```txt
User Login/Signup
↓
JWT Token Generated
↓
Token Stored
↓
Authenticated APIs Access
```

### Guest User Flow

If user is not logged in:

* User can browse donors
* User can search blood
* User cannot become donor
* User cannot request blood directly
* Login modal opens automatically on protected actions

---

# 2. Google Login Integration

## Integrated Using

* Google Identity Services
* Google OAuth

## Flow

```txt
User clicks Google Login
↓
Google Authentication Success
↓
Backend verifies Google token
↓
User created/fetched
↓
If phone not verified
   → OTP verification modal opens
↓
Phone verification completed
↓
User logged in successfully
```

## Important Logic

* Google login alone is not enough
* Phone verification is mandatory for donor-related actions
* OTP modal opens immediately after Google login
* No separate redirect page used

---

# 3. OTP Verification System

## Integrated Using

* Twilio Verify API

## Features

* OTP Send
* OTP Verify
* Resend OTP
* Verification Error Handling
* Success/Error Toasts

## OTP Flow

```txt
User enters phone number
↓
Backend sends OTP
↓
Twilio Verify API
↓
User enters OTP
↓
Backend verifies OTP
↓
Phone marked verified
```

## Twilio Verify Integration

### Required ENV

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
```

---

# 4. SMS Alert System

## Purpose

Emergency blood request alerts sent to donors.

## Integrated Using

* Twilio SMS API

## Features

* Instant donor alert
* Multiple donor support
* SMS fallback support
* Error handling

## Flow

```txt
Blood Request Created
↓
Find Matching Donors
↓
Send SMS Alerts
↓
Donor receives emergency request
```

## SMS Message Example

```txt
Urgent blood request for A+ blood group near Chandigarh.
Please contact +91XXXXXXXXXX.
```

---

# 5. WhatsApp Alert Integration

## Integrated Using

* Twilio WhatsApp Sandbox

## Current Status

* Development sandbox working
* Instant WhatsApp alerts sending successfully

## WhatsApp Flow

```txt
Request Blood
↓
Open Alert Modal
↓
Select WhatsApp option
↓
Backend calls Twilio WhatsApp API
↓
Donor receives WhatsApp alert
```

## Twilio Sandbox Setup

### Required Steps

1. Open Twilio WhatsApp Sandbox
2. Join sandbox from WhatsApp
3. Send join code
4. Backend can send WhatsApp alerts

## ENV Variables

```env
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## Message Send Example

```ts
await client.messages.create({
  from: process.env.TWILIO_WHATSAPP_FROM,
  to: `whatsapp:${donor.mobileNo}`,
  body: message,
});
```

## Planned Production Flow

```txt
Meta Business Verification
↓
Approved WhatsApp Sender
↓
Template Approval
↓
Production Messaging
```

## Future Improvements

* Queue System (BullMQ)
* Delivery Tracking
* Bulk Alert Optimization
* Retry Failed Messages

---

# 6. Blood Request Module

## Features

* Search donors
* Filter by blood group
* Filter by location
* Emergency request flow
* SMS alerts
* WhatsApp alerts

## Flow

```txt
User searches donor
↓
User clicks Request Blood
↓
Alert modal opens
↓
Select SMS/WhatsApp
↓
Alert sent to donor
```

## Alert Modal Features

* SMS checkbox
* WhatsApp checkbox
* Share details confirmation
* Send button

---

# 7. Donor Module

## Features

* Become Donor
* Donor Profile Setup
* Blood Group Information
* Availability Status
* Location Management

## Important Logic

### Normal User

* Limited profile fields
* Cannot request donor-only actions

### Donor User

* Additional donor fields required
* Blood group mandatory
* Address/location required
* Phone verification mandatory

## Donor Flow

```txt
User Login
↓
Phone Verification
↓
Become Donor
↓
Complete Donor Profile
↓
Available in donor search
```

---

# 8. Profile Management

## Features

* Update profile
* Profile completion percentage
* Avatar support
* Donor-specific fields
* Disabled phone editing after verification

## Location Handling

If state/city changes:

* Latitude updated
* Longitude updated
* Search location updated

---

# 9. Avatar System

## Features

* Default avatars assigned automatically
* Blood donation themed avatars
* User receives avatar after registration

## Logic

```txt
User registers
↓
Random predefined avatar assigned
↓
Saved in database
```

---

# 10. Search System

## Features

* Blood group search
* State/city search
* Nearby donor search
* Empty state handling

## Search Flow

```txt
User selects blood group + location
↓
Backend filters donors
↓
Matching donors returned
```

---

# 11. Protected Routing

## Logic

### Guest User

* Redirect/login modal for protected actions

### Authenticated User

* Allowed access based on role

## Protected Routes

* Profile
* Become Donor
* Request Blood

---

# 12. UI/UX Features

## Features

* Sticky transparent navbar
* Responsive design
* Smooth form typing
* Toast notifications
* Loading states
* Error handling
* Professional landing page

## UI Libraries

* shadcn/ui
* Tailwind CSS
* Lucide Icons

---

# 13. Playwright E2E Testing

## Integrated Using

* Playwright

## Current Test Coverage

### Authentication

* OTP login flow
* Login modal open
* Logout flow
* Guest access checks

### Donor Flow

* Become donor access
* Donor form validation
* Donor form submission

### Search Flow

* Donor search
* Empty state handling

### Landing

* Landing page load

## Testing Features

* API mocking
* UI validation
* Navigation checks
* Route protection

## Playwright Setup

```bash
npm install -D @playwright/test
npx playwright install
```

## Run Tests

```bash
npx playwright test
```

---

# 14. Backend Architecture

## Built Using NestJS

### Structure

```txt
Controller
↓
Service
↓
Repository/Model
↓
Database
```

## Implemented Features

* DTO Validation
* Global Exception Filters
* Interceptors
* Guards
* JWT Middleware
* Role-based access

---

# 15. Database

## MongoDB Atlas

### Main Collections

* users
* donors
* bloodRequests
* alertLogs
* otpVerifications

## User Schema Includes

* name
* email
* mobileNo
* role
* bloodGroup
* avatar
* isPhoneVerified
* latitude
* longitude

---

# 16. Deployment

## Current Deployment Stack

* AWS EC2
* PM2
* Nginx
* MongoDB Atlas

## Deployment Flow

```txt
GitHub Push
↓
EC2 Pull Latest Code
↓
Build Application
↓
PM2 Restart
↓
Nginx serves app
```

## Important Tools

* PM2 for process management
* Nginx reverse proxy
* GitHub for version control

---

# 17. Environment Variables

## Backend ENV

```env
PORT=
MONGODB_URI=
JWT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
TWILIO_WHATSAPP_FROM=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Frontend ENV

```env
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
```

---

# 18. Future Improvements

## Planned Features

* Redis Queue System
* BullMQ Worker
* Push Notifications
* Donor Availability Tracking
* Real-time Socket Alerts
* Admin Dashboard
* Alert Analytics
* Delivery Tracking
* WhatsApp Template System

---

# 19. Best Practices Implemented

## Frontend

* Modular folder structure
* Reusable components
* Typed APIs
* Form validation
* Protected routes

## Backend

* DTO validation
* Service-based architecture
* Centralized error handling
* Environment-based configuration

## Security

* JWT authentication
* OTP verification
* Protected APIs
* Role-based authorization

---

# 20. Overall Application Flow

```txt
User visits application
↓
Search donors or create account
↓
Phone verification
↓
Become donor (optional)
↓
Request blood during emergency
↓
System finds matching donors
↓
SMS + WhatsApp alerts sent
↓
Donor contacts requester
```

---

# Project Status

## Currently Working

* Authentication
* OTP verification
* Google login
* Donor onboarding
* Blood search
* SMS alerts
* WhatsApp alerts
* Profile management
* Playwright testing
* AWS deployment

## Ready For

* Production deployment
* WhatsApp production approval
* Queue optimization
* Scaling
