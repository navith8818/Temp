# Server Salad Cloud Services — Customer Hosting Portal

A minimal, clean, production-quality customer hosting dashboard designed for **Server Salad Cloud Services**, integrating with **HestiaCP** as the external hosting control panel.

Built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Lucide React**.

---

## 🎨 Design Philosophy & Brand Identity

- **Brand Palette:**
  - White: `#FFFFFF`
  - Black: `#000000` / Deep Slate: `#111618`
  - Orange Accent: `#F57E20`
  - Dark Gray Surfaces: `#323D41` / `#161D20` / `#1E2629`
  - Subtle Neutral Dividers & Text: `#283337`, `#8A9BA1`, `#CAD6DB`
- **Minimalism & Calm Hierarchy:** High information density without visual noise. Eliminates decorative widgets and heavy borders in favor of understated progress bars, clear typography, and generous whitespace.
- **Progressive Disclosure:** Advanced infrastructure settings remain tucked away until explicitly requested by the customer.

---

## 🚀 Key Features

1. **Main Hosting Overview (`HostingOverview` & `HostingMetrics`):**
   - Displays hosting plan name, active status pill, and server IP with one-click copy.
   - Plan-level metrics: Storage allocation (thin progress bar), Domain capacity (`2 / 5`), and Active websites.
   - Primary `Manage` CTA button opening the left slide-over drawer.
   - Secondary `Add Website` CTA button.
   - 3-dot plan overflow menu with quick SSO launch and telemetry refresh.

2. **Left-Side Slide-Over Management Drawer (`HostingManagementDrawer`):**
   - Smooth slide-in transition from the **left** of the screen (380–460px width on desktop, full-width on mobile).
   - Backdrop overlay with click-to-dismiss, Esc keyboard listener, and focus trapping.
   - **Default Panel Sections:**
     - **Renewal (`RenewalSection`):** Expiration date, pricing, billing cycle, and interactive auto-renewal toggle.
     - **HestiaCP Access (`HestiaAccessSection`):** Primary "Open HestiaCP" launch button, sanitized access metadata (URL, username, server IP), zero exposed plaintext secrets.
     - **Hosting Usage (`HostingUsageSection`):** Storage breakdown (Web, DB, Mail), Bandwidth quota, and Inode file counts with restrained progress bars.
     - **Files & Storage (`FileStorageSection`):** Capacity allocation, path reference (`/home/usr_salad_84/web/`), and direct HestiaCP Web File Manager link.
   - **Advanced Options — Progressive Disclosure (`AdvancedOptionsSection`):**
     - Expands downwards within the drawer upon clicking the gear icon.
     - Collapsible subsections for PHP runtime switcher (8.1 to 8.4), DNS nameservers, Let's Encrypt SSL status, Roundcube Webmail, Automated Backups, and Service Cancellation requests.

3. **Websites Management (`WebsiteList`, `WebsiteRow`, `WebsiteActionsMenu`):**
   - Clean scannable table list of domains (`freshkitchen.io`, `craftsalad.dev`).
   - Domain status badges, SSL indicators, and application preset tags (WordPress 6.9, PHP 8.3).
   - 3-dot contextual menu: Open HestiaCP domain, Manage files, Open phpMyAdmin, View SSL details, and Remove website.

4. **Add Website Modal (`AddWebsiteDialog`):**
   - Live domain regex validation.
   - Simulated DNS pointer availability check.
   - App preset selection (WordPress, PHP/Static, Node.js, Laravel).
   - Safe domain capacity counter (e.g., prevents adding beyond plan limit).

5. **Products & New Hosting Catalog (`/hosting/new`):**
   - Dedicated route for browsing Server Salad hosting tiers (Starter, Essential, Pro).
   - Datacenter location selector (Frankfurt, London, Virginia, Singapore).
   - Monthly vs. Annual billing toggle with 20% discount calculation.

6. **Interactive Toast Feedback (`ToastProvider`):**
   - Real-time feedback on user actions (auto-renewal switch, copying IPs, launching SSO sessions, adding/removing websites).

---

## 📁 Component Architecture

```
customer-portal/
├── src/
│   ├── app/
│   │   ├── globals.css              # Brand palette and dark theme
│   │   ├── layout.tsx               # Root layout with ToastProvider and Navbar
│   │   ├── page.tsx                 # Main dashboard route
│   │   └── hosting/
│   │       └── new/
│   │           └── page.tsx         # New hosting tier selection route
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── HostingDashboard.tsx     # Root dashboard controller
│   │   │   ├── HostingOverview.tsx      # Main plan card & manage triggers
│   │   │   ├── HostingMetrics.tsx       # Understated resource counters
│   │   │   ├── WebsiteList.tsx          # Domains list container
│   │   │   ├── WebsiteRow.tsx           # Individual domain row
│   │   │   ├── WebsiteActionsMenu.tsx   # 3-dot dropdown actions
│   │   │   ├── AddWebsiteDialog.tsx     # Add domain modal dialog
│   │   │   ├── WebsiteDetailsDialog.tsx # Detailed domain inspector modal
│   │   │   └── DeleteConfirmDialog.tsx  # Website removal confirmation
│   │   ├── drawer/
│   │   │   ├── HostingManagementDrawer.tsx # Left-side slide-over panel
│   │   │   ├── RenewalSection.tsx          # Billing & auto-renew toggle
│   │   │   ├── HestiaAccessSection.tsx     # HestiaCP SSO & credentials
│   │   │   ├── HostingUsageSection.tsx     # Storage, bandwidth & inodes
│   │   │   ├── FileStorageSection.tsx      # File manager link & capacity
│   │   │   └── AdvancedOptionsSection.tsx  # Progressive disclosure controls
│   │   └── ui/
│   │       ├── Navbar.tsx           # Top navigation with Server Salad branding
│   │       ├── StatusBadge.tsx      # Consistent status badges
│   │       ├── UsageProgress.tsx    # Thin custom progress bars
│   │       └── Toast.tsx            # Toast notification context & alerts
│   ├── data/
│   │   └── mockHostingData.ts       # Realistic mock data & service layer
│   └── types/
│       └── hosting.ts               # Strict TypeScript domain models
```

---

## 🔌 Connecting to NestJS Backend

The application is structured with a decoupled service layer in [`src/data/mockHostingData.ts`](file:///c:/Users/navithranviru/Desktop/New%20folder/customer-portal/src/data/mockHostingData.ts).

To connect to your live NestJS API:
1. Replace simulated promises in `hostingService` with `fetch` or `axios` calls pointing to your backend endpoints:
   - `GET /api/v1/hosting/plans/:id`
   - `GET /api/v1/hosting/plans/:id/websites`
   - `PATCH /api/v1/hosting/plans/:id/auto-renew`
   - `POST /api/v1/hosting/plans/:id/websites`
   - `DELETE /api/v1/hosting/websites/:id`
2. No UI component modifications are required because the components consume the clean TypeScript contracts defined in [`src/types/hosting.ts`](file:///c:/Users/navithranviru/Desktop/New%20folder/customer-portal/src/types/hosting.ts).

---

## 🛠️ Development & Build Commands

```bash
# Navigate to the portal directory
cd customer-portal

# Install dependencies (if needed)
npm install

# Start the local development server (http://localhost:3000)
npm run dev

# Run production build
npm run build

# Start production server
npm run start
```
