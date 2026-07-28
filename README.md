<div align="center">

# 🚀 FundNova Server API

[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.9-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe_SDK-v17-008CDD?style=for-the-badge&logo=stripe)](https://stripe.com/)

The RESTful API engine power behind **FundNova** — providing secure authentication, role-based authorization, virtual ledger management, automated pledge refunds, Stripe payments, and Cloudinary media management.

[Main Repository](file:///c:/Users/USER/OneDrive/Desktop/fundnova/README.md) • [Client App](file:///c:/Users/USER/OneDrive/Desktop/fundnova/fundnova-client/README.md)

</div>

---

## 📌 Architecture & Capabilities

- **Role-Based Auth & Security**: JWT bearer authentication, role guards (`Supporter`, `Creator`, `Admin`), bcrypt password security, Helmet HTTP headers, and rate limiting.
- **Atomic Credit Ledger Engine**:
  - Automatically awards initial credits (50 to Supporters, 20 to Creators).
  - Handles credit pledges to approved campaigns.
  - Triggers **atomic credit refunds** upon pledge rejection or campaign deletion.
- **Stripe & Payout Services**:
  - Payment intent creation for purchasing platform credit packages.
  - Creator withdrawal request processing ($1 USD = 20 Raised Credits, min 200 credits).
- **Admin Moderation & Reporting**:
  - Campaign approval/rejection endpoints.
  - Account removal and role management.
  - Resolution of campaign fraud reports.
- **Notification & Media System**: Integrated in-app notifications and Cloudinary image upload middleware.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js, TypeScript (`tsx` for dev watch mode)
- **Framework**: Express.js
- **Database & Schemas**: MongoDB, Mongoose ORM
- **Security**: JWT, bcrypt, Helmet, CORS, Express Rate Limit
- **Integrations**: Stripe Node SDK, Cloudinary, Multer, Nodemailer, Zod

---

## 🔌 API Endpoint Directory

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register Supporter or Creator
- `POST /api/auth/login` — Authenticate user & retrieve token

### Campaigns (`/api/campaigns`)
- `GET /api/campaigns` — Fetch active approved campaigns
- `GET /api/campaigns/top-funded` — Fetch top 6 funded campaigns
- `GET /api/campaigns/:id` — Fetch campaign by ID
- `POST /api/campaigns` — Create new campaign *(Creator)*
- `PATCH /api/campaigns/:id` — Update campaign details *(Creator)*
- `DELETE /api/campaigns/:id` — Delete campaign & refund supporters *(Creator/Admin)*

### Contributions (`/api/contributions`)
- `POST /api/contributions` — Pledge credits to campaign *(Supporter)*
- `GET /api/contributions/supporter` — View paginated supporter history
- `GET /api/contributions/creator/pending` — View pending campaign pledges *(Creator)*
- `PATCH /api/contributions/:id/approve` — Approve pledge *(Creator)*
- `PATCH /api/contributions/:id/reject` — Reject pledge & refund credits *(Creator)*

### Payments & Payouts (`/api/payments`, `/api/withdrawals`)
- `POST /api/payments/create-intent` — Stripe payment intent for credit purchase
- `GET /api/payments/history` — View payment transactions history
- `POST /api/withdrawals` — Request creator payout *(Creator)*
- `GET /api/withdrawals/creator` — Creator payout history

### Admin Suite (`/api/admin`)
- `GET /api/admin/stats` — Platform metrics & financial overview
- `GET /api/admin/campaigns/pending` — List pending campaign submissions
- `PATCH /api/admin/campaigns/:id/status` — Approve or reject campaign
- `GET /api/admin/withdrawals/pending` — List pending withdrawal requests
- `PATCH /api/admin/withdrawals/:id/approve` — Approve withdrawal & deduct credits
- `GET /api/admin/users` — Account management list
- `PATCH /api/admin/users/:id/role` — Modify user role
- `DELETE /api/admin/users/:id` — Remove user account
- `GET /api/admin/reports` — Fraud reports log

---

## 🚀 Quick Start

```bash
# Navigate to server directory
cd fundnova-server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server with live reload
npm run dev
```

Server runs on `http://localhost:5000` by default.

---

<div align="center">
Part of the <b>FundNova Crowdfunding Platform</b> ecosystem.
</div>
