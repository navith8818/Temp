# Server Salad Admin Portal — System Architecture & Data Flow

This document details the architectural design, component composition, state management, and domain modeling for the Server Salad Cloud Services Administration Portal.

```
                           +---------------------------+
                           |  Browser (React 19 / DOM) |
                           +-------------+-------------+
                                         |
                                         v
                         +---------------+---------------+
                         |      React Router v7 Route    |
                         |           /admin/*            |
                         +---------------+---------------+
                                         |
                                         v
                         +---------------+---------------+
                         |      AdminDataContext         |
                         |  (Reactive In-Memory Store &  |
                         |   localStorage Persistence)   |
                         +---------------+---------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
        +------------+------------+             +------------+------------+
        |   Layout & Navigation   |             |   Active Feature Page   |
        |   - AdminTopBar         |             |   - Modules A through S |
        |   - AdminNavDrawer      |             |   - Data Tables         |
        |   - Role Simulator      |             |   - Inspector Drawers   |
        +-------------------------+             +-------------------------+
```

---

## 1. Domain Entities & Type Models

The domain model is defined in `lithos-hero/src/admin/types/index.ts` and models real-world hosting entities:

1. **Infrastructure Tier:**
   - `HostingServer`: Hostname, IP, server type (`SHARED_HOSTING`, `VPS_NODE`), provider (`WHM_CPANEL`, `PROXMOX_KVM`), resource capacity (CPU, RAM, disk, accounts limit), health check status.
   - `ServerGroup`: Allocation strategy (`LEAST_UTILIZED`, `ROUND_ROBIN`, `FILL_TO_CAPACITY`), failover assignments, member server IDs.
   - `ProvisioningJob`: Queue state (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`), step-by-step audit logs, technical error payloads, customer-safe error messages.

2. **Commercial & Customer Tier:**
   - `Customer`: Contact profile, balance, verified status, service count, login lockout flag, hosting suspended flag, billing addresses, internal notes.
   - `HostingProduct`: Web and VPS plans, multi-cycle pricing (Monthly, Quarterly, Semi-Annual, Annual, Triennial), WHM package mapping, server group bindings, trial period rules.
   - `HostingService`: Provisioned customer account, linked server, cPanel username, live disk and bandwidth usage meters, dedicated IP, suspension reasons.
   - `CustomerOrder`: Shopping cart checkout lifecycle, payment gateway references, associated invoice numbers.

3. **Financial Tier:**
   - `Invoice`: Line items, subtotals, tax calculations, discounts, payment status (`PAID`, `UNPAID`, `OVERDUE`, `REFUNDED`), dates.
   - `PaymentTransaction`: PayHere & Stripe settlement records, gateway transaction IDs, webhook payloads, authorized refund tracking.
   - `Subscription`: Next renewal dates, renewal pricing, auto-renew status, grace period policy tracking (5 days), retry count.

4. **Support & Operations Tier:**
   - `SupportTicket`: Customer conversations, department routing, priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), internal staff notes (marked private), assigned agent.
   - `LiveChatSession`: Real-time conversation thread, agent queue acceptance, canned responses, live session resolution.
   - `NotificationLog`: Resend delivery events, recipient email, subject, merge variable substitution, retry triggers.
   - `AuditLog`: Immutable platform security log recording actor, role, target resource, outcome, timestamp, and details.

---

## 2. State Management & Reactivity

All administrative operations are backed by the **`AdminDataContext`**:
- **Persistence:** LocalStorage key `server_salad_admin_data_v1` ensures changes persist across page reloads during evaluation.
- **Factory Reset:** Built-in `resetDemoData()` instantly re-seeds the operational state from `mockAdminData.ts`.
- **Role Simulation:** `currentRole` dynamically switches between `ADMINISTRATOR`, `STAFF`, `SUPPORT_AGENT`, and `BILLING_STAFF` to demonstrate role-based access control.
- **Toast Messaging:** Non-blocking notification toasts confirm background job executions, server tests, refunds, and ticket actions.

---

## 3. UI Component System

Reusable UI components reside in `lithos-hero/src/admin/components/ui/`:
- **`AdminTable<T>`**: High-density table featuring column sorting, fuzzy search filtering across multiple object attributes, pagination, and empty/loading states.
- **`AdminDrawer`**: Slide-over inspector panel supporting right-anchored full-height detail views without losing table context.
- **`AdminModal`**: Accessible focused dialog for confirmations, refunds, and creation forms.
- **`AdminBadge`**: Low-saturation, minimal status pills with semantic color treatments (success, warning, danger, neutral).
- **`AdminMetricCard`**: Compact KPI statistics cards with delta indicators and direct navigation triggers.
- **`AdminTabs`**: Understated tab bar with item counts for dividing dense records.
