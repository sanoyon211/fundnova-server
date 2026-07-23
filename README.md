# FundNova Server API Documentation 🚀

Backend API server for **FundNova** Crowdfunding Platform built with Express.js, TypeScript, and MongoDB.

## 📌 Core Features
- **User Authentication**: JWT-based Auth (`/api/auth/register`, `/api/auth/login`) with role management (Supporter, Creator, Admin).
- **Default Credits**: Supporter gets 50 credits, Creator gets 20 credits on registration.
- **Campaign CRUD**: Creation (pending status), retrieval, updates, and deletion (with automatic supporter credit refunds).
- **Contribution Management**: Supporter pledges, creator approval/rejection (auto-refund on rejection).
- **Credit Purchase**: Stripe payment intent integration ($1 = 10 Credits).
- **Withdrawal Requests**: Creator earnings withdrawal ($1 = 20 Raised Credits, min threshold 200 credits).
- **Admin Portal**: Platform statistics, campaign approvals/rejections, withdrawal approvals (deducts creator raised credits), user role management, campaign removal, and fraud reports.
- **Notifications System**: In-app notifications sorted by user email.

## 🔑 Admin Credentials
- **Admin Email**: `admin@fundnova.com`
- **Admin Password**: `AdminSecret123!`

## 🛠️ API Endpoint Summary

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Register Supporter or Creator
- `POST /api/auth/login` — Sign in and get JWT token

### Campaign Routes (`/api/campaigns`)
- `GET /api/campaigns` — Fetch approved active campaigns
- `GET /api/campaigns/top-funded` — Top 6 funded campaigns
- `GET /api/campaigns/:id` — Get campaign details
- `POST /api/campaigns` — Create new campaign (Creator)
- `PATCH /api/campaigns/:id` — Update campaign (Creator)
- `DELETE /api/campaigns/:id` — Delete campaign & refund supporters

### Contribution Routes (`/api/contributions`)
- `POST /api/contributions` — Pledge credits to campaign
- `GET /api/contributions/supporter` — View supporter contribution history (paginated)
- `GET /api/contributions/creator/pending` — View pending pledges to review
- `PATCH /api/contributions/:id/approve` — Approve pledge
- `PATCH /api/contributions/:id/reject` — Reject pledge & refund credits

### Payment Routes (`/api/payments`)
- `POST /api/payments/create-intent` — Stripe credit purchase intent
- `GET /api/payments/history` — Supporter payment history

### Withdrawal Routes (`/api/withdrawals`)
- `POST /api/withdrawals` — Request creator payout (min 200 credits)
- `GET /api/withdrawals/creator` — Creator withdrawal history

### Admin Routes (`/api/admin`)
- `GET /api/admin/stats` — Platform statistics overview
- `GET /api/admin/campaigns/pending` — Pending campaign approvals
- `PATCH /api/admin/campaigns/:id/status` — Approve/Reject campaign
- `GET /api/admin/withdrawals/pending` — Pending withdrawal requests
- `PATCH /api/admin/withdrawals/:id/approve` — Approve withdrawal & deduct credits
- `GET /api/admin/users` — Manage user accounts
- `PATCH /api/admin/users/:id/role` — Update user role
- `DELETE /api/admin/users/:id` — Remove user account
- `GET /api/admin/reports` — Fraud reports list

### Notification Routes (`/api/notifications`)
- `GET /api/notifications` — Get notifications for logged in user
- `PATCH /api/notifications/:id/read` — Mark notification as read
