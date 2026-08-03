# CoverFlow - Insurance Management Platform

**CoverFlow** is a modern, enterprise-grade Insurance Management SaaS Platform built to streamline policy creation, customer lifecycle tracking, First Notice of Loss (FNOL) claims processing, and premium payment recording.

---

## 🚀 Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System, Glassmorphism UI
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Authentication**: Clerk Authentication (`@clerk/clerk-react`)

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL (Supabase) & Prisma ORM
- **Request Validation**: Zod (`zod`)
- **Authentication & Middleware**: Clerk Express Middleware (`@clerk/express`)

---

## ✨ Core Features

1. **Customer Management**: Full CRUD policyholder management, profile registries, and contact records.
2. **Policy Lifecycle Management**: Issue active policies, auto-generate unique policy numbers (`POL-YYYY-XXXX`), renew, and cancel policies.
3. **Premium Tracking System**: Log payments, track billing statuses (`PAID`, `PENDING`, `OVERDUE`), and record database transactions with Zod request validation.
4. **Claims Processing (FNOL)**: File First Notice of Loss claims, link to policy IDs, and manage claim verification (`PENDING` ➔ `VERIFIED` ➔ `APPROVED` / `REJECTED`).
5. **Executive Analytics Dashboard**: Real-time KPI statistics (Total Customers, Active Policies, Revenue sum, Pending Claims) and combined recent operations feed.
6. **System Reports & Data Export**: Server-side CSV streaming report generators and instant print/PDF export (`window.print()`).
7. **Validation & Error Handling**: Modular Zod schema validation middleware (`validateRequest`) and global error handler (`errorHandler`).
8. **Dark Mode & Responsive UI**: Built-in Dark/Light mode toggle switch (`darkMode: 'class'`) and mobile collapsible sidebar navigation.

---

## 🛠️ Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm package manager
- PostgreSQL Database URL (or Supabase Connection String)

### 1. Clone & Setup Repository
```bash
git clone https://github.com/Sarthak170306/CoverFlow.git
cd CoverFlow
```

### 2. Backend Setup (`server/`)
```bash
cd server
npm install

# Configure Environment Variables
# Create a .env file inside server/ directory:
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/dbname"
CLIENT_URL="http://localhost:5173"
CLERK_SECRET_KEY="sk_test_xxx"
CLERK_PUBLISHABLE_KEY="pk_test_xxx"

# Push Schema to PostgreSQL Database & Generate Prisma Client
npx prisma db push
npx prisma generate

# Start Express API Server
npm run dev
```

### 3. Frontend Setup (`client/`)
```bash
cd ../client
npm install

# Configure Environment Variables
# Create a .env file inside client/ directory:
VITE_API_BASE_URL="http://localhost:5000/api"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxx"

# Start Vite Development Server
npm run dev
```

The application will be accessible locally at `http://localhost:5173`.

---

## 🔐 Test Credentials

Use these dummy credentials or Clerk test accounts to test the role-based features of CoverFlow:

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@coverflow.com` | `AdminPass123!` | Full System & Executive Analytics |
| **Underwriting Agent** | `agent@coverflow.com` | `AgentPass123!` | Customer, Policy & Claim Management |
| **Customer / Policyholder** | `customer@coverflow.com` | `CustomerPass123!` | Personal Policies & Payment Portal |

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
