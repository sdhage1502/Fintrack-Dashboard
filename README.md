# FinTrack - Modern Finance Dashboard

**Live Link:** [[https://fintrack-dashboard-opal.vercel.app/](https://fintrack-dashboard-opal.vercel.app/)] 🌍

## 🔐 System Access Credentials
*(Please test and update these with your actual seeded accounts before submitting)*
- **Admin Account:** `admin@gmail.com` / `admin123`
- **User Account:** `max@gmail.com` / `max123`


---

FinTrack is a premium, high-performance finance management dashboard built for modern web standards. It features a sleek "Nocturnal" dark-mode aesthetic, highly interactive data visualizations, and robust Role-Based Access Control (RBAC) securely backed by Firebase. 

---

## 1. Project Implementation Analysis & Requirement Verification

The FinTrack Dashboard has been rigorously built and analyzed against the assigned requirements. All core objectives, functional constraints, and bonus features have been successfully implemented. 

### Implementation Checklist
| Requirement | Implemented | Notes |
| :--- | :---: | :--- |
| **Dashboard overview with summary cards** | ✅ Yes | Cards for Total Balance, Monthly Income, and Expenses available. |
| **Time-based chart (balance trend)** | ✅ Yes | Interactive Recharts area chart mapped to timeline data. |
| **Category chart (spending breakdown)** | ✅ Yes | Pie chart detailing top 5 expense categories dynamically. |
| **Transactions section** | ✅ Yes | Full CRUD operations included with date, amount, category, type. |
| **Search functionality** | ✅ Yes | Robust formatting-safe search across names and amounts. |
| **Filtering functionality** | ✅ Yes | Filters for Categories, Income/Expense, and Active Month. |
| **Sorting functionality** | ✅ Yes | Transactions globally sorted by Date descending natively. |
| **Role-based UI (Admin/Viewer)** | ✅ Yes | Firebase Auth/Firestore RBAC enforces UI & data restrictions. |
| **Insights section** | ✅ Yes | Spending insights derived visually on the Dashboard & Admin views. |
| **State management** | ✅ Yes | Managed centrally and painlessly via Zustand stores. |
| **Responsive design** | ✅ Yes | Fully responsive Grid/Flexbox layouts across all viewports. |
| **Empty state handling** | ✅ Yes | Custom empty states provided for missing transactions. |
| **Clean UI and UX** | ✅ Yes | Night-mode glassmorphism styling, Framer Motion animations. |
| *Optional: Dark mode* | ✅ Yes | Nocturnal theme natively applied. |
| *Optional: Export data* | ✅ Yes | CSV parsing and export implemented seamlessly. |

---

## 2. Admin and User Functionality Documentation

### **Admin Functionality**
The `Admin` role possesses supreme privileges across the platform:
- **Global Overview**: Can view dashboards, platform analytics, and a Global Transaction Feed populated by all users.
- **Transaction Management**: Possesses universal authority to Add, Edit, or Delete any transaction.
- **User Management**: Exclusive access to the `/admin` Panel to view all registered users and directly modify their security roles (Promote to Admin, Demote to User, or Block completely).
- **Export**: Can extract platform-wide transactional data to CSV.

### **User Functionality**
The `User` role is standard, isolated use of the platform:
- **Personal Dashboard**: Can view the dashboard, charts, transactions, and insights *strictly limited to their own data*.
- **Transaction Management**: Can Add, Edit, and Delete their own transactions.
- **Export**: Can export only their personal ledger to CSV.

### **Viewer Functionality**
The `Viewer` is a restricted, audit-only role:
- **Read-Only**: Can view insights, dashboards, and transactions securely.
- **Restrictions**: All UI components responsible for structural data mutation (Add/Edit buttons, Trash icons, Admin Panel links) are completely hidden or disabled. 

---

## 3. Project Architecture Documentation

- **Folder Structure**: Structured utilizing Next.js 14 App Router patterns. Critical views (`/dashboard`, `/transactions`, `/admin`) scale independently. Reusable atomic UI parts map into `/components`.
- **Component Structure**: Designed cleanly utilizing Tailwind CSS styling macros (`glass-card`, `text-gradient`) alongside `lucide-react` for iconography.
- **State Management Approach**: Zustand is deployed across two primary stores (`useAuthStore` and `useTransactionStore`). Zustand enables zero-boilerplate reactive access to shared state without prop-drilling or overusing React Context. 
- **Data Flow**: Firebase snapshot listeners actively hydrate the Zustand stores. Any CRUD operation pushes directly to Firestore, subsequently updating the snapshot listeners and immediately updating the UI in a unidirectional flow.
- **Role-based Logic**: Defined by `authGuard` on a route-level, preventing URL-based bypassing. Firestore security rules enforce database-level access, and boolean evaluations (e.g. `const canEdit = ...`) control UI button rendering dynamically based on stored user profile roles.
- **Chart Implementation**: Bootstrapped using `recharts` wrapped inside `ResponsiveContainer` blocks. Mappings iterate over the Zustand transaction arrays locally rather than hammering the database with aggregation queries.
- **Responsiveness**: Utilized mobile-first Tailwind grids (`grid-cols-1 md:grid-cols-3...`) and specific flex-stacking wrappers specifically to guarantee usability across small-viewport touch devices without horizontal clipping.

---

## 4. Submission Summary Document

**Approach:**
The objective was to deliver a dashboard that wasn't just functional, but demonstrably production-ready. The foundation was laid by standardizing styling tokens immediately to guarantee consistency, followed firmly by hooking up secure Firebase authentication before handling local states. 

**Design Decisions:**
I deliberately strayed away from stark, boring spreadsheet interfaces. Financial data natively carries high cognitive load, so I chose a fluid dark-theme (glassmorphism) that leverages depth (`backdrop-blur`) and micro-animations to create an exceedingly premium UX that feels closer to an established App Store product than a web application.

**Challenges Faced:**
1. _Firebase Role Enforcement_: Establishing robust separation between "what a User sees" vs "what an Admin sees" while sharing the same component skeletons caused early friction. The solution was introducing specific conditional hooks within the fetching queries themselves `query(where("userId", "==", user.uid))` to strictly cut off data overflow.
2. _Search and Filter Architecture_: Balancing a multi-faceted search parameter involving Date/Time, String matching, and Categorical filters against a single payload required precision array chaining and string formatting adjustments (handling dollar signs and exact month/year metrics).

**Future Improvements:**
- Implement Virtualized Lists on the transactions page to ensure 60fps scrolling even if a user has thousands of records.
- Introduce `React.lazy()` boundaries specifically around heavy Charting libraries to optimize initial browser paint load times on slow mobile networks. 

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Authentication)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Folder Structure

```
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── admin/            # Admin Panel (Protected)
│   ├── dashboard/        # Main User Dashboard
│   ├── transactions/     # Transaction Management & History
│   ├── profile/          # User Settings & Profile
│   └── layout.tsx        # Root Layout & Providers
├── components/           # Reusable UI Components
│   ├── FinChart.tsx      # Time-based Area Chart
│   ├── CategoryPieChart  # Categorical Pie Chart
│   ├── Sidebar.tsx       # Main Navigation
│   └── TransactionModal  # Form for Adding/Editing entries
├── store/                # Zustand State Management
│   ├── authStore.ts      # Authentication & Role State
│   └── transactionStore  # Optimistic Transaction Data Flow
├── lib/                  # Utilities and Config
│   └── firebase.ts       # Firebase Initialization
└── types/                # TypeScript Interfaces
```

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd Fintrack-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> Built as part of a Frontend Developer Internship Assessment.
