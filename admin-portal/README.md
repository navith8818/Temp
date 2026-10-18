# Server Salad Cloud Services — Internal Administration Portal

> **Enterprise Cloud Hosting Management, Infrastructure Allocation, Automated Provisioning, Billing & Support Platform**

---

## 1. Executive Overview

The **Server Salad Admin Portal** is an interactive, light-themed, professional internal management system built specifically for the Server Salad Cloud Services hosting operations team.

Designed in strict accordance with Server Salad's established visual identity, the portal provides a fast, minimal, high-density interface where administrators, infrastructure engineers, billing staff, and support agents can manage the complete lifecycle of cloud hosting products, servers, customer accounts, orders, recurring invoices, and customer communications.

---

## 2. Quick Access & Running the Standalone Next.js Portal

The Admin Portal is built as an independent, standalone **Next.js 16 (Turbopack) + React 19 + TypeScript** application matching `customer-portal`:

- **Standalone Portal URL:** [http://localhost:3001](http://localhost:3001) (or [http://localhost:3001/dashboard](http://localhost:3001/dashboard))
- **Default Port:** `3001` (avoids conflict with `customer-portal` on `3000` and `lithos-hero` on `5173`)
- **Backward Compatible Route Rewrites:** Both root routes (`/servers`, `/tickets`, etc.) and `/admin/*` routes (`/admin/servers`, `/admin/tickets`) resolve transparently.

### Development Commands
```bash
# Navigate to the admin-portal folder
cd "admin-portal"

# Run development server with Turbopack on port 3001
npm run dev

# Run full Next.js production build (typechecks and pre-renders all 22 static pages)
npm run build

# Start production server
npm run start
```

---

## 3. Visual & UX Architecture

The portal adheres to the **Server Salad Design System**:
- **Light & Professional Canvas:** Clean white surfaces (`#ffffff`), subtle backgrounds (`#f8f9fa`), and light borders (`border-gray-200/90`).
- **Signature Brand Accent:** Server Salad Orange (`#e8702a` / `#d2611f`) reserved for primary action triggers and active state indicators.
- **Typography:** Inter for high legibility data tables and dense numeric data, with Playfair Display for brand titles.
- **Hidden & Contextual Drawer Navigation:** A collapsible overlay drawer accessible via the top-bar menu icon (`Esc`, backdrop click, or destination select to dismiss), leaving 100% of the screen width available for data management.
- **Progressive Disclosure:** Advanced settings (cPanel package quotas, WHM socket timeouts, API tokens, internal notes) remain tucked into accordions, slide-over inspector drawers, and contextual tabs until intentionally accessed.

---

## 4. Module Directory & Capabilities

The portal consists of **19 complete, functional modules**:

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **A. Dashboard** | `/admin/dashboard` | Real-time KPIs, failing job alerts, servers needing attention, recent payments, open tickets |
| **B. Servers** | `/admin/servers` | Server inventory, WHM/cPanel ping test, capacity meters, maintenance toggle, reboot |
| **C. Packages** | `/admin/packages` | Web & VPS packages, billing cycle pricing, WHM package mapping, server group assignment |
| **D. Server Groups** | `/admin/server-groups` | Allocation policies (Least Utilized, Round Robin, Fill-to-Capacity), failover groups |
| **E. Customers** | `/admin/customers` | Customer directory, balance, hosting suspend/resume, login lockout, slide-over inspector |
| **F. Orders** | `/admin/orders` | Order lifecycle (Pending, Processing, Completed), manual approval, provisioning trigger |
| **G. Hosting Services** | `/admin/services` | Provisioned cPanel/VPS accounts, live disk/bandwidth usage, suspend/unsuspend, termination |
| **H. Provisioning** | `/admin/provisioning` | Job queue, step-by-step progress, failure inspection, idempotent retry recovery |
| **I. Billing & Invoices** | `/admin/invoices` | Invoices list, line item totals, status toggles (Mark as Paid, Void), download PDF |
| **J. Payments & Refunds** | `/admin/payments` | PayHere gateway logs, webhook payload inspector, authorized refunds (Scenario E) |
| **K. Subscriptions** | `/admin/subscriptions` | Recurring renewal cycles, 5-day grace period enforcement, retry charge, cancellation |
| **L. Support Tickets** | `/admin/tickets` | Multi-turn customer threads, private internal staff notes, agent reassignment, status changes |
| **M. Live Chat** | `/admin/live-chat` | Real-time agent chat queue, customer accept, canned responses, live session resolution |
| **N. Notifications** | `/admin/notifications` | Delivery logs, failure retry, customizable email templates with merge tags (`{customer_name}`) |
| **O. Staff & Permissions** | `/admin/staff` | Operator directory, role switcher (Administrator, Staff, Support Agent, Billing Staff) |
| **P. Reports & Analytics** | `/admin/reports` | MRR / ARR metrics, churn rates, server capacity forecasting, support SLA response times |
| **Q. Audit Logs** | `/admin/audit-logs` | Immutable security audit trail recording all staff mutations, refunds, and access events |
| **R. Domains & SSL** | `/admin/domains` | Registered domains, authoritative DNS verification, Let's Encrypt AutoSSL renewal |
| **S. Settings** | `/admin/settings` | WHM/cPanel API credentials, PayHere merchant keys, Resend mailer, grace period rules |

---

## 5. Built-in Demonstration Scenarios (A – H)

The platform is pre-loaded with realistic hosting data and interactive state machines to demonstrate every requested business workflow:

1. **Scenario A — Create & Configure Hosting Package:** Navigate to `/admin/packages`, click **Add Package**, configure disk/RAM/cPanel package name (`salad_turbo_nvme`) and server group, then save.
2. **Scenario B — Add & Allocate Server:** Navigate to `/admin/servers`, click **Add Server**, test WHM API connection, set 50-account capacity, and enable automatic allocation.
3. **Scenario C — Create & Provision Service:** Navigate to `/admin/orders`, inspect pending order `#ORD-9204`, click **Approve & Provision**, and watch the provisioning pipeline create the active hosting service.
4. **Scenario D — Provisioning Failure Recovery:** In `/admin/dashboard` or `/admin/provisioning`, inspect failed job `#JOB-8841` ("WHM socket connection timed out"), click **Retry Job**, and observe automated recovery.
5. **Scenario E — Customer Billing & Refund:** Navigate to `/admin/payments`, locate transaction `TXN-88412`, click **Refund**, review the authorization warning, execute refund, and see invoice `#INV-2026-089` update automatically.
6. **Scenario F — Support Ticket Management:** Navigate to `/admin/tickets`, open ticket `#TICK-4102`, toggle between public customer reply and private yellow **Internal Staff Note**, and reassign agent.
7. **Scenario G — Role & Permission Matrix:** Use the role dropdown in the top bar or `/admin/staff` to switch between `Administrator`, `Operations Staff`, `Support Agent` (Finance tabs hidden), and `Billing Staff` (Infrastructure hidden).
8. **Scenario H — Visual & Responsive Polish:** Collapse/expand the navigation drawer via `Menu` or `Esc`, explore slide-over inspector drawers, collapsible accordions, and metric cards.

---

## 6. Project Structure

```
lithos-hero/src/admin/
├── AdminApp.tsx               # Primary admin router mounting all 19 sub-pages
├── types/
│   └── index.ts               # Complete TypeScript types and interfaces
├── data/
│   └── mockAdminData.ts       # Realistic relational seed data (Servers, Customers, Jobs, etc.)
├── context/
│   └── AdminDataContext.tsx   # Reactive state management with localStorage persistence & mutators
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx    # Responsive shell with sticky top-bar and hidden drawer
│   │   ├── AdminTopBar.tsx    # Logo, breadcrumb, server heartbeat, role switcher & reset button
│   │   └── AdminNavDrawer.tsx # Hidden drawer navigation with counters & permission filters
│   └── ui/
│       ├── AdminBadge.tsx     # Minimal status badges (success, warning, danger, neutral)
│       ├── AdminButton.tsx    # Styled action buttons (primary, secondary, outline, ghost, danger)
│       ├── AdminTable.tsx     # High-density searchable, sortable, paginated data table
│       ├── AdminModal.tsx     # Accessible modal dialogs
│       ├── AdminDrawer.tsx    # Slide-over record inspector drawer
│       ├── AdminTabs.tsx      # Clean tabbed navigation
│       ├── AdminConfirmDialog.tsx # Destructive action confirmation dialogs
│       ├── AdminMetricCard.tsx # Clean KPI metric display cards
│       └── AdminToast.tsx     # Non-intrusive alert toast notifications
└── pages/
    ├── DashboardPage.tsx      # Module A
    ├── ServersPage.tsx        # Module B
    ├── PackagesPage.tsx       # Module C
    ├── ServerGroupsPage.tsx   # Module D
    ├── CustomersPage.tsx      # Module E
    ├── OrdersPage.tsx         # Module F
    ├── ServicesPage.tsx       # Module G
    ├── ProvisioningPage.tsx   # Module H
    ├── InvoicesPage.tsx       # Module I
    ├── PaymentsPage.tsx       # Module J
    ├── SubscriptionsPage.tsx  # Module K
    ├── TicketsPage.tsx        # Module L
    ├── LiveChatPage.tsx       # Module M
    ├── NotificationsPage.tsx  # Module N
    ├── StaffPage.tsx          # Module O
    ├── ReportsPage.tsx        # Module P
    ├── AuditLogsPage.tsx      # Module Q
    ├── DomainsPage.tsx        # Module R
    └── SettingsPage.tsx       # Module S
```
