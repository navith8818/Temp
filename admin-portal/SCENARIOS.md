# Server Salad Cloud Services — Admin Portal Demonstration Scenarios (A – H)

This document provides a step-by-step testing and verification guide for the demonstration scenarios requested for the Server Salad Cloud Services Admin Portal.

---

### Scenario A — Create & Configure a Web Hosting Package

**Objective:** Create a new hosting product, configure billing cycle pricing, link it to a cPanel/WHM package template, and assign it to an infrastructure server group.

1. **Navigate to:** `http://localhost:5173/admin/packages` (or open Navigation Drawer -> **Business** -> **Products & Packages**).
2. **Action:** Click the **Add Package** button in the top right.
3. **Fill Form:**
   - **Package Name:** `Turbo NVMe Pro Plus`
   - **Category:** `Web Hosting (cPanel / WHM)`
   - **Monthly Price:** `14.99`
   - **Annual Price:** `149.90`
   - **Storage Quota:** `50 GB NVMe`
   - **Bandwidth Quota:** `Unlimited (Unmetered)`
   - **Server Group:** Select `Frankfurt NVMe Group (FRA-POOL-01)`
   - **WHM Package Identifier:** `salad_turbo_pro_plus`
4. **Submit:** Click **Create Package**.
5. **Expected Outcome:**
   - A success toast notification is displayed.
   - The new package appears immediately in the data table.
   - A security audit log entry is recorded in `/admin/audit-logs`.

---

### Scenario B — Add & Allocate Server

**Objective:** Add a new WHM/cPanel or Proxmox hypervisor node, run a connection test, configure resource capacity, and enable automatic service allocation.

1. **Navigate to:** `http://localhost:5173/admin/servers` (Navigation Drawer -> **Infrastructure** -> **Servers**).
2. **Action:** Click the **Add Server** button in the top right.
3. **Fill Form:**
   - **Server Display Name:** `FRA-WEB-NODE-03`
   - **Hostname / FQDN:** `fra03.serversalad.net`
   - **Public IP Address:** `185.190.140.24`
   - **Provider / Software:** `WHM / cPanel`
   - **Datacenter Location:** `Frankfurt, Germany (FRA-DC2)`
   - **Account Capacity Limit:** `50`
   - **Automatic Allocation:** Toggle `Enabled`
4. **Test Connection:** Click **Test WHM API Connection**. Observe the simulated socket handshake ping response.
5. **Submit:** Click **Register Server**.
6. **Expected Outcome:**
   - The server is registered with status `ONLINE`.
   - Capacity meters reflect 0/50 accounts allocated.
   - Automatic allocation is active for new customer orders.

---

### Scenario C — Create & Provision Hosting Service

**Objective:** Approve a pending customer order, trigger the automated provisioning pipeline, create the cPanel account on the allocated server, and activate the service.

1. **Navigate to:** `http://localhost:5173/admin/orders` (Navigation Drawer -> **Business** -> **Orders**).
2. **Inspect:** Locate pending order `#ORD-9204` (Customer: `Daniel Vance`, Product: `Startup Cloud Hosting`, Status: `AWAITING_PAYMENT` / `PROCESSING`).
3. **Action:** Click the **Approve & Provision** action button on the order row.
4. **Observe Provisioning:**
   - The order status transitions to `COMPLETED`.
   - A provisioning job is queued and executed.
   - Navigate to `/admin/services` to inspect the newly activated hosting account (`vancegrowth.com`).
   - Navigate to `/admin/provisioning` to see the completed provisioning execution steps (DNS zone, WHM package assignment, welcome email dispatch).

---

### Scenario D — Provisioning Failure Recovery

**Objective:** Inspect a failed provisioning job, examine technical failure logs, and execute an idempotent retry to bring the service into an active, healthy state.

1. **Navigate to:** `http://localhost:5173/admin/dashboard` or `http://localhost:5173/admin/provisioning`.
2. **Inspect Failure:**
   - The dashboard displays a red **Provisioning Attention** alert card.
   - On `/admin/provisioning`, locate failed job `#JOB-8841` (Domain: `urbanloftdesign.co.uk`, Status: `FAILED`).
3. **View Technical Error:**
   - Click the **Inspect** button.
   - The step inspector shows failure at Step 2: `CREATE_CPANEL_ACCOUNT`.
   - Internal Error: `[WHM_API_TIMEOUT] Socket closed by remote host after 15000ms during userdb initialization`.
   - Customer-Safe Message: `Account setup is taking slightly longer than expected while we configure your server quotas.`
4. **Execute Retry:**
   - Click the **Retry Job** button.
5. **Expected Outcome:**
   - The job enters `RETRYING` and then completes with status `COMPLETED`.
   - The hosting service status in `/admin/services` switches from `PENDING` to `ACTIVE`.
   - A recovery toast is triggered and recorded in Audit Logs.

---

### Scenario E — Customer Billing & Refund

**Objective:** Review an online payment transaction processed via PayHere/Stripe, inspect the gateway webhook payload, and execute an authorized refund that updates the associated invoice.

1. **Navigate to:** `http://localhost:5173/admin/payments` (Navigation Drawer -> **Finance** -> **Payments & Refunds**).
2. **Inspect Transaction:**
   - Locate payment `TXN-88412` ($49.00 USD, Customer: `Marcus Sterling`).
   - Click **Details** to review the PayHere webhook payload and response code.
3. **Initiate Refund:**
   - Click the **Refund** button.
   - An authorized modal appears displaying a financial authorization notice.
   - Enter refund reason: `Customer requested plan downgrade reversal`.
   - Click **Execute Refund**.
4. **Expected Outcome:**
   - Transaction status changes to `REFUNDED`.
   - Related invoice `#INV-2026-089` in `/admin/invoices` is updated to status `REFUNDED`.
   - A security audit event is logged with operator ID and timestamp.

---

### Scenario F — Support Ticket Management & Internal Notes

**Objective:** Review open support tickets, reply to the customer, post private staff notes, and reassign the ticket to another technical agent.

1. **Navigate to:** `http://localhost:5173/admin/tickets` (Navigation Drawer -> **Support** -> **Support Tickets**).
2. **Open Thread:** Click **Open Thread** on ticket `#TICK-4102` (`PHP curl extension missing on cPanel PHP 8.3`).
3. **Inspect Thread:**
   - Note the customer's request and the linked service domain (`freshkitchen.io`).
4. **Post an Internal Staff Note:**
   - In the composer, check the **Post as Internal Staff Note** checkbox.
   - Notice the composer turns warm amber with a clear warning: `(hidden from customer)`.
   - Type note: `Verified via WHM EasyApache4: curl extension was rebuilt and enabled on PHP 8.3.`
   - Click **Save Internal Note**.
   - The note appears in the thread with an amber badge: `INTERNAL NOTE (STAFF ONLY)`.
5. **Send Customer Reply:**
   - Uncheck the internal note checkbox.
   - Type customer reply: `Hello Elena, PHP 8.3 curl has been re-enabled for your cPanel container.`
   - Click **Send Customer Reply**.
6. **Reassign Agent & Status:**
   - Change Status to `WAITING_FOR_CUSTOMER`.
   - Change Assigned Agent to `Sarah Jenkins`.

---

### Scenario G — Staff Permissions & Role Simulation

**Objective:** Switch between administrative roles to verify permission-based view constraints across navigation, data access, and sensitive financial/infrastructure actions.

1. **Navigate to:** `http://localhost:5173/admin/staff` (or use the role switcher in the top navigation bar).
2. **Role Tests:**
   - **Administrator (Full Access):** All 19 navigation items visible.
   - **Operations Staff:** Can manage servers, server groups, provisioning, and customers. Financial refund triggers disabled.
   - **Support Agent:**
     - Open navigation drawer: Notice **Finance** group (`Invoices`, `Payments`, `Subscriptions`) and **Settings** are hidden.
     - Can view customer details and manage tickets and live chat.
   - **Billing Staff:**
     - Open navigation drawer: Notice **Infrastructure** group (`Servers`, `Server Groups`) is hidden.
     - Has full access to invoices, payments, subscriptions, and refunds.
3. **Verify Feedback:** When switching roles, an informational toast confirms the active simulated perspective.

---

### Scenario H — Visual Design & Usability Polish

**Objective:** Verify clean light aesthetics, minimal layout density, and fluid drawer interactions.

1. **Top Bar & Drawer:**
   - Click the **Menu** icon on the top bar: Drawer slides in smoothly from the left.
   - Press `Escape` or click the darkened backdrop: Drawer closes immediately.
   - Current page is clearly highlighted with Server Salad orange accent (`#e8702a`).
2. **Progressive Disclosure:**
   - Go to `/admin/customers` and click **Inspect**: Slide-over drawer opens with tabbed sub-sections (Overview, Services, Orders, Billing, Support, Notes).
   - Go to `/admin/settings` -> **WHM Integration**: Click **Advanced WHM Socket Options** to reveal advanced connection timeout and TLS 1.3 settings.
3. **Demo Reset:** Click the **Reset Demo** button in the top bar anytime to restore initial seed data.
