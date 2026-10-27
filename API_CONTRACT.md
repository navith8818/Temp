# Server Salad Cloud Services — Complete System API Contract

**Version:** `1.0.0`  
**Base URL:** `https://api.serversalad.com/api/v1`  
**Environments:**  
- Production: `https://api.serversalad.com/api/v1`
- Staging: `https://staging-api.serversalad.com/api/v1`
- Local Development: `http://localhost:4000/api/v1`

---

## 1. Global Architectural & Security Standards

### 1.1 Authentication & Authorization
The platform operates a dual-token JWT security model with separate role scopes:
- **Customer Realm (`CUSTOMER`):** Authenticates via customer credentials. Has tenant-level isolation (can only access resources where `customerId == req.user.id`).
- **Staff / Admin Realm (`STAFF`):** Authenticates administrative operators. Enforces granular Role-Based Access Control (`StaffRole`):
  - `ADMINISTRATOR`: Super-admin, unrestricted access across all endpoints.
  - `STAFF`: Infrastructure, server management, provisioning, and customer operations. Financial refunds and sensitive config disabled.
  - `SUPPORT_AGENT`: Tickets, live chat, customer inspection. Billing, infrastructure, and settings hidden/forbidden (`403 Forbidden`).
  - `BILLING_STAFF`: Invoices, transactions, subscriptions, refunds, customer billing profile. Server hypervisor nodes and system configs hidden/forbidden (`403 Forbidden`).

#### Headers
```http
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
Accept: application/json
X-Client-Version: 1.0.0
X-Request-ID: <uuid_v4>
Idempotency-Key: <uuid_v4>   # Mandatory for /checkout, /payments/:id/refund, and /provisioning/retry
```

---

### 1.2 Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-10-27T15:30:00.000Z",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `409`, `422`, `500`)
Compliant with RFC 7807 problem details:
```json
{
  "success": false,
  "statusCode": 422,
  "timestamp": "2026-10-27T15:30:00.000Z",
  "error": "UnprocessableEntityException",
  "message": "Validation failed for domain record",
  "details": [
    {
      "field": "domain",
      "issue": "Invalid FQDN format or TLD not supported"
    }
  ],
  "path": "/api/v1/customer/hosting/plans/plan_785df5d6/websites"
}
```

---

## 2. Shared & Authentication Endpoints

### 2.1 Customer Authentication (`/auth`)

#### `POST /auth/register`
Creates a new customer account from the storefront registration form.
- **Access:** Public
- **Request Body:**
```json
{
  "fullName": "Daniel Vance",
  "email": "daniel@vancegrowth.com",
  "password": "SecurePassword123!",
  "company": "Vance Growth Ltd",
  "phone": "+44 7700 900077",
  "billingAddress": {
    "line1": "100 Bishopsgate",
    "city": "London",
    "country": "United Kingdom",
    "postalCode": "EC2N 4AG"
  }
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "usr_c91a0b3",
      "fullName": "Daniel Vance",
      "email": "daniel@vancegrowth.com",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "expiresIn": 3600
    }
  }
}
```

#### `POST /auth/login`
Authenticates existing customers.
- **Access:** Public
- **Request Body:**
```json
{
  "email": "sarah.jenkins@serversalad.cloud",
  "password": "CustomerSecretPassword123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "usr_salad_84",
      "fullName": "Sarah Jenkins",
      "email": "sarah.jenkins@serversalad.cloud",
      "company": "Fresh Kitchen Media S.A.",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "expiresIn": 3600
    }
  }
}
```

#### `POST /auth/refresh`
Rotates access token using stored refresh token.
- **Access:** Public (with valid refresh token)
- **Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```
- **Response (`200 OK`):** Returns new `accessToken` and `refreshToken`.

#### `POST /auth/forgot-password`
Triggers password reset email with temporary cryptographic token via Resend.
- **Request Body:** `{ "email": "daniel@vancegrowth.com" }`
- **Response (`200 OK`):** `{ "success": true, "message": "Password reset instructions sent." }`

---

### 2.2 Admin Staff Authentication (`/admin/auth`)

#### `POST /admin/auth/login`
Authenticates staff members and administrators.
- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@serversalad.net",
  "password": "MasterAdminSecretPassword123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "staff": {
      "id": "staff_01",
      "name": "Sarah Jenkins",
      "email": "admin@serversalad.net",
      "role": "ADMINISTRATOR",
      "department": "Infrastructure & Operations"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "expiresIn": 28800
    }
  }
}
```

#### `GET /admin/auth/me`
Retrieves authenticated staff profile, active role, and system permissions.
- **Access:** Staff Bearer Token

---

## 3. Web Portal (Public Storefront & Onboarding)

### 3.1 Public Product Catalog & Pricing

#### `GET /catalog/products`
Retrieves all publicly available hosting packages.
- **Access:** Public
- **Query Params:**
  - `type`: `SHARED` | `VPS` (optional filter)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "prod_web_essential",
      "slug": "web-hosting-essential",
      "name": "Web Hosting",
      "tagline": "Essential",
      "type": "SHARED",
      "priceMonthlyLkr": 458,
      "priceAnnualLkr": 4580,
      "priceRenewalUsd": 2.99,
      "cpu": "2x CPU Performance",
      "storage": "50 GB SSD Cloud storage",
      "storageGb": 50,
      "domainsAllowed": 5,
      "trial": true,
      "trialDays": 30,
      "features": [
        "Fully optimised for WordPress",
        "2x CPU Performance",
        "50 GB SSD Cloud storage",
        "Unlimited hosted domains",
        "Unlimited websites",
        "Secured by SSL",
        "5 mailboxes per domain free for 1 year"
      ]
    },
    {
      "id": "prod_vps_pro",
      "slug": "vps-hosting-pro",
      "name": "VPS Hosting",
      "tagline": "Pro Dedicated",
      "type": "VPS",
      "priceMonthlyLkr": 2450,
      "priceAnnualLkr": 24500,
      "priceRenewalUsd": 12.50,
      "cpu": "4x Dedicated vCPU",
      "storage": "100 GB NVMe Storage",
      "storageGb": 100,
      "domainsAllowed": 10,
      "trial": false,
      "trialDays": 0,
      "features": [
        "Dedicated IP Address",
        "4x Dedicated vCPU",
        "100 GB NVMe Storage",
        "Unlimited Bandwidth",
        "Root Access Included",
        "Advanced cPGuard Security",
        "Free Weekly Backups"
      ]
    }
  ]
}
```

#### `GET /catalog/addons/email-plans`
Retrieves available email add-ons (e.g. Spacemail Pro).
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "spacemail-pro",
      "name": "Spacemail Pro",
      "mailboxCount": 1,
      "storageGb": 5,
      "aliasesCount": 10,
      "trialDays": 30,
      "renewalPriceYearlyUsd": 11.76
    }
  ]
}
```

#### `POST /catalog/domains/check`
Validates domain syntax, resolves WHOIS/DNS availability, or verifies pointer status.
- **Request Body:**
```json
{
  "domain": "nodegen.com",
  "type": "external" // "registered" | "external" | "existing"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "domain": "nodegen.com",
    "status": "valid",
    "available": false,
    "isPointerConfigured": true,
    "suggestedNameservers": ["ns1.serversalad.com", "ns2.serversalad.com"],
    "priceLkr": 0
  }
}
```

#### `POST /checkout/promo/validate`
Validates a promotional coupon code.
- **Request Body:**
```json
{
  "code": "SALAD50",
  "productId": "prod_web_essential",
  "billingCycle": "MONTHLY"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "code": "SALAD50",
    "discountPercentage": 50,
    "discountAmountLkr": 229,
    "message": "50% promotional discount applied successfully."
  }
}
```

---

### 3.2 Checkout & Provisioning Submission

#### `POST /checkout/order`
Submits an end-to-end checkout payload, creates the Customer record (if guest), creates Order and Invoice records, processes initial billing, and kicks off provisioning.
- **Header:** `Idempotency-Key: <unique_client_generated_uuid>`
- **Request Body:**
```json
{
  "productId": "prod_web_essential",
  "billingCycle": "MONTHLY",
  "setupMode": "new", // "new" | "migrate"
  "migrationDetails": {
    "sourceUrl": "https://cpanel.myoldhost.com:2083",
    "cpanelUser": "olduser",
    "notes": "Please migrate WordPress site + MySQL db"
  },
  "domains": [
    {
      "name": "nodegen.com",
      "type": "external",
      "priceLkr": 0
    }
  ],
  "selectedEmailPlanId": "spacemail-pro",
  "includeAutoBackup": true,
  "promoCode": "SALAD50",
  "customer": {
    "fullName": "Alex Jayawardena",
    "email": "alex@nodegen.com",
    "address": "42 Galle Road",
    "city": "Colombo 03",
    "country": "Sri Lanka",
    "vatNumber": ""
  },
  "payment": {
    "method": "card", // "card" | "payhere" | "stripe"
    "cardNumber": "4532892012048821",
    "cardHolder": "Alex Jayawardena",
    "cardExpiry": "08/28",
    "cardCvc": "892",
    "saveCard": true
  }
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "orderId": "ord_9204",
    "orderNumber": "ORD-9204",
    "invoiceId": "inv_88129",
    "invoiceNumber": "INV-2026-092",
    "customerId": "usr_alex_01",
    "provisioningJobId": "job_88419",
    "status": "PROCESSING",
    "initialAmountChargedLkr": 0,
    "currency": "LKR",
    "redirectUrl": "/order/processing?jobId=job_88419"
  }
}
```

#### `GET /orders/:id/tracking`
Polls or monitors order setup timeline progress.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_9204",
    "status": "PROCESSING",
    "currentStep": 4,
    "totalSteps": 6,
    "steps": [
      { "id": 1, "label": "Order confirmed & invoice generated", "completed": true },
      { "id": 2, "label": "Payment authorization verified", "completed": true },
      { "id": 3, "label": "Provisioning NVMe cloud storage container", "completed": true },
      { "id": 4, "label": "Configuring cPanel & WHM control environment", "completed": false, "inProgress": true },
      { "id": 5, "label": "Issuing Let's Encrypt wildcard SSL certificate", "completed": false },
      { "id": 6, "label": "Hosting service activated & live", "completed": false }
    ],
    "service": {
      "id": "srv_41029",
      "primaryDomain": "nodegen.com",
      "serverIp": "198.51.100.42",
      "status": "PROVISIONING"
    }
  }
}
```

---

## 4. Customer Portal (Self-Service Dashboard)

### 4.1 Hosting Service Management

#### `GET /customer/hosting/plans`
Lists all active hosting services owned by the authenticated customer.
- **Access:** Customer Bearer Token
- **Response (`200 OK`):** Array of `HostingPlan` entities.

#### `GET /customer/hosting/plans/:id`
Retrieves detailed real-time hosting plan status, quotas, and server metrics.
- **Access:** Customer Bearer Token
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "plan_785df5d6",
    "name": "Web Hosting Essential",
    "tier": "Essential SSD NVMe",
    "status": "active",
    "primaryDomain": "freshkitchen.io",
    "serverHost": "cp1.serversalad.com",
    "serverIp": "198.51.100.42",
    "controlPanelPort": 8083,
    "hestiaUsername": "usr_salad_84",
    "productId": "prod_web_essential",
    "startedAt": "2026-01-13T00:00:00Z",
    "renewalDate": "2026-11-15T00:00:00Z",
    "renewalPrice": 9.99,
    "billingCycle": "monthly",
    "autoRenew": true,
    "storageUsedGb": 8.4,
    "storageTotalGb": 25.0,
    "storageBreakdown": {
      "webGb": 5.6,
      "dbGb": 1.8,
      "mailGb": 0.7,
      "backupGb": 0.3
    },
    "bandwidthUsedGb": 42.6,
    "bandwidthTotalGb": 500.0,
    "domainCount": 2,
    "domainLimit": 5,
    "websiteCount": 2,
    "inodesUsed": 68420,
    "inodesTotal": 250000,
    "phpVersion": "8.3",
    "availablePhpVersions": ["8.1", "8.2", "8.3", "8.4"],
    "webServer": "Nginx + PHP-FPM",
    "sslActive": true,
    "dnsNameservers": ["ns1.serversalad.com", "ns2.serversalad.com"],
    "backupSummary": {
      "lastBackup": "2026-10-27T03:00:00Z",
      "retentionDays": 14,
      "frequency": "Daily Automated",
      "snapshotSizeGb": 2.1,
      "totalSnapshots": 14
    },
    "mailboxesUsed": 2,
    "mailboxesLimit": 10
  }
}
```

#### `POST /customer/hosting/plans/:id/sso-session`
Generates a secure, single-use, time-limited token to directly access external HestiaCP or cPanel without displaying plaintext passwords.
- **Access:** Customer Bearer Token
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://cp1.serversalad.com:8083/login/?token=sso_99a8b1c7d34e20984",
    "expiresAt": "2026-10-27T15:35:00Z"
  }
}
```

#### `PATCH /customer/hosting/plans/:id/auto-renew`
Toggles subscription auto-renewal.
- **Request Body:** `{ "autoRenew": true }`
- **Response (`200 OK`):** `{ "success": true, "autoRenew": true }`

#### `PATCH /customer/hosting/plans/:id/php-version`
Updates default server PHP version for this hosting container.
- **Request Body:** `{ "phpVersion": "8.4" }`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "planId": "plan_785df5d6",
    "phpVersion": "8.4",
    "updatedAt": "2026-10-27T15:31:00Z"
  }
}
```

#### `POST /customer/hosting/plans/:id/cancel`
Submits a service cancellation request and creates a support ticket.
- **Request Body:**
```json
{
  "reason": "Project completed, no longer requiring this server",
  "cancellationType": "END_OF_CYCLE" // "IMMEDIATE" | "END_OF_CYCLE"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "ticketId": "TICK-41920",
    "status": "CANCELLATION_PENDING"
  }
}
```

---

### 4.2 Websites / Virtual Host Management

#### `GET /customer/hosting/plans/:id/websites`
Lists all domains/websites configured in this hosting plan.
- **Response (`200 OK`):** Array of `Website` items.

#### `POST /customer/hosting/plans/:id/websites`
Adds a new domain / website to the hosting account. Triggers control panel API to create the vhost, directory structure, and Let's Encrypt SSL.
- **Request Body:**
```json
{
  "domain": "craftsalad.dev",
  "appType": "WordPress", // "WordPress" | "PHP/Static" | "Node.js" | "Laravel" | "Custom"
  "phpVersion": "8.3"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "web_02",
    "hostingPlanId": "plan_785df5d6",
    "domain": "craftsalad.dev",
    "status": "active",
    "createdAt": "2026-10-27T15:32:00Z",
    "appType": "WordPress",
    "phpVersion": "8.3",
    "sslActive": true,
    "sslIssuer": "Let's Encrypt Authority X3",
    "sslExpiresInDays": 90,
    "documentRoot": "/home/usr_salad_84/web/craftsalad.dev/public_html",
    "storageUsedMb": 120,
    "databaseCount": 0,
    "emailCount": 0,
    "isPrimary": false
  }
}
```

#### `GET /customer/hosting/websites/:id`
Retrieves single website details.

#### `DELETE /customer/hosting/websites/:id`
Removes a virtual host and deletes associated docroot and configs after confirmation.
- **Response (`200 OK`):** `{ "success": true, "message": "Website removed successfully" }`

---

### 4.3 Billing, Invoices & Payment Methods

#### `GET /customer/billing/summary`
Retrieves financial overview: next renewal, current price, credit balance.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "currentPlanName": "Web Hosting Essential",
    "currentPlanPrice": 9.99,
    "billingCycle": "monthly",
    "nextBillingDate": "2026-11-15",
    "autoRenew": true,
    "creditBalance": 25.0
  }
}
```

#### `GET /customer/billing/invoices`
Lists customer invoices with pagination.
- **Query:** `page=1&limit=20`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_01",
      "invoiceNumber": "INV-2026-0891",
      "date": "2026-10-15",
      "dueDate": "2026-10-15",
      "period": "Oct 15, 2026 – Nov 14, 2026",
      "amount": 9.99,
      "currency": "USD",
      "status": "paid",
      "paymentMethodSummary": "Visa ending in 4242",
      "items": [
        {
          "id": "li_01",
          "description": "Web Hosting Essential — 25 GB NVMe SSD",
          "quantity": 1,
          "unitPrice": 9.99,
          "total": 9.99
        }
      ],
      "subtotal": 9.99,
      "taxRate": 0,
      "taxAmount": 0.0,
      "total": 9.99,
      "pdfUrl": "/api/v1/customer/billing/invoices/inv_01/pdf"
    }
  ]
}
```

#### `GET /customer/billing/invoices/:id/pdf`
Streams generated invoice PDF binary (`application/pdf`).

#### `GET /customer/billing/payment-methods`
Lists saved credit cards / payment methods.

#### `POST /customer/billing/payment-methods`
Attaches a new payment card via Stripe / PayHere gateway tokenization.
- **Request Body:**
```json
{
  "gatewayToken": "tok_visa_4242",
  "cardholderName": "Sarah Jenkins",
  "isDefault": true
}
```

#### `PATCH /customer/billing/payment-methods/:id/default`
Sets specified payment method as primary default for recurring subscriptions.

#### `DELETE /customer/billing/payment-methods/:id`
Removes a saved card.

#### `POST /customer/billing/redeem-promo`
Redeems a gift card or account credit promo code.
- **Request Body:** `{ "code": "WELCOME25" }`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "creditAdded": 25.0,
    "newBalance": 50.0,
    "message": "Welcome credit applied! $25.00 added to account balance."
  }
}
```

---

### 4.4 Account Profile, Security & Notifications

#### `GET /customer/profile`
Retrieves customer profile, contact details, active sessions, and SSH keys.

#### `PATCH /customer/profile`
Updates contact settings, company name, timezone, or email alert preferences.

#### `POST /customer/profile/ssh-keys`
Adds an authorized public SSH key for terminal access.
- **Request Body:**
```json
{
  "name": "MacBook Pro - Workstation",
  "publicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
}
```

#### `DELETE /customer/profile/ssh-keys/:id`
Deletes an SSH key from all provisioned customer servers.

#### `DELETE /customer/profile/sessions/:id`
Revokes an active web browser session.

#### `GET /customer/notifications`
Retrieves real-time customer notification feed.
- **Query:** `unreadOnly=false`

#### `PATCH /customer/notifications/:id/read`
Marks a notification as read.

#### `PATCH /customer/notifications/read-all`
Marks all notifications as read.

---

## 5. Admin Portal (Superadmin & Infrastructure Operations)

### 5.1 Infrastructure: Servers & Hypervisors (`/admin/servers`)

#### `GET /admin/servers`
Lists all bare-metal nodes, WHM servers, and VPS hypervisors.
- **Access:** Staff (Role: `ADMINISTRATOR`, `STAFF`)
- **Query:** `provider=WHM_CPANEL&status=ONLINE`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "srv_fra_01",
      "name": "FRA-WEB-NODE-01",
      "hostname": "fra01.serversalad.net",
      "ipAddress": "185.190.140.22",
      "provider": "WHM_CPANEL",
      "serverType": "SHARED_HOSTING",
      "os": "CloudLinux 9.4 (Almalinux)",
      "datacenter": "Frankfurt DC-01",
      "location": "Frankfurt, Germany",
      "status": "ONLINE",
      "capacity": {
        "cpuCores": 32,
        "cpuUsagePct": 28.4,
        "ramGb": 128,
        "ramUsageGb": 48.2,
        "storageGb": 2000,
        "storageUsageGb": 640.5,
        "accountsCount": 84,
        "accountsLimit": 150
      },
      "allocatedServicesCount": 84,
      "allocationEnabled": true,
      "lastHealthCheck": "2026-10-27T15:20:00Z",
      "providerConfig": {
        "port": 2087,
        "useSsl": true,
        "hasApiToken": true,
        "nameservers": ["ns1.serversalad.com", "ns2.serversalad.com"]
      }
    }
  ]
}
```

#### `POST /admin/servers`
Registers a new hypervisor or hosting server node.
- **Request Body:**
```json
{
  "name": "FRA-WEB-NODE-03",
  "hostname": "fra03.serversalad.net",
  "ipAddress": "185.190.140.24",
  "provider": "WHM_CPANEL",
  "serverType": "SHARED_HOSTING",
  "datacenter": "Frankfurt, Germany (FRA-DC2)",
  "location": "Frankfurt, Germany",
  "accountsLimit": 50,
  "allocationEnabled": true,
  "providerConfig": {
    "port": 2087,
    "useSsl": true,
    "apiUsername": "root",
    "apiToken": "WHMAPITOKENSECRET123456789"
  }
}
```
- **Response (`201 Created`):** Returns created server object.

#### `POST /admin/servers/:id/test-connection`
Executes an active API socket handshake ping to verify credentials and connectivity.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "serverStatus": "ONLINE",
    "latencyMs": 42,
    "providerVersion": "cPanel & WHM v120.0.11",
    "message": "Connection established successfully via TLS 1.3"
  }
}
```

#### `PATCH /admin/servers/:id/allocation`
Toggles whether new customer orders can be provisioned onto this server.
- **Request Body:** `{ "allocationEnabled": false }`

#### `POST /admin/servers/:id/health-check`
Forces immediate telemetry polling of CPU, RAM, disk, and socket health.

#### `DELETE /admin/servers/:id`
Decommissions a server. Only allowed if `allocatedServicesCount === 0`.

---

### 5.2 Server Groups & Allocation Strategies (`/admin/server-groups`)

#### `GET /admin/server-groups`
Retrieves all server groups.

#### `POST /admin/server-groups`
Creates a pool of servers with an automated allocation policy.
- **Request Body:**
```json
{
  "name": "Frankfurt NVMe Group (FRA-POOL-01)",
  "purpose": "SHARED_HOSTING",
  "provider": "WHM_CPANEL",
  "location": "Frankfurt, Germany",
  "allocationPolicy": "BALANCED", // "BALANCED" | "PACK_FIRST" | "MANUAL"
  "serverIds": ["srv_fra_01", "srv_fra_02"],
  "enabled": true
}
```

---

### 5.3 Products & Packages (`/admin/products`)

#### `GET /admin/products`
Retrieves all catalog packages with administrative metrics (services count, orders count).

#### `POST /admin/products`
Creates a new hosting product and maps it to a WHM package template and server group.
- **Request Body:**
```json
{
  "name": "Turbo NVMe Pro Plus",
  "slug": "turbo-nvme-pro-plus",
  "type": "SHARED",
  "priceMonthly": 14.99,
  "priceAnnual": 149.90,
  "storageGb": 50,
  "domainLimit": 10,
  "bandwidthGb": 1000,
  "whmPackageName": "salad_turbo_pro_plus",
  "serverGroupId": "grp_fra_pool_01",
  "published": true
}
```

#### `PATCH /admin/products/:id`
Updates product specifications, pricing, or WHM mappings.

#### `POST /admin/products/:id/duplicate`
Clones an existing product into a new draft package.

#### `PATCH /admin/products/:id/publish`
Toggles public catalog visibility.

#### `PATCH /admin/products/:id/disable-sales`
Disables new customer sales while keeping grandfathered subscriptions active.

---

### 5.4 Customer Administration (`/admin/customers`)

#### `GET /admin/customers`
Retrieves customer directory with search, filter, and balance indicators.
- **Query:** `search=Daniel&status=ACTIVE&page=1&limit=25`

#### `GET /admin/customers/:id`
Retrieves complete customer dossier: profile, active services, orders history, unpaid invoices, tickets, and internal staff notes.

#### `PATCH /admin/customers/:id`
Updates customer profile or contact details.

#### `PATCH /admin/customers/:id/toggle-login`
Suspends or reinstates customer portal login access.

#### `PATCH /admin/customers/:id/toggle-hosting`
Suspends or unsuspends all hosting containers owned by this customer across all servers.

#### `POST /admin/customers/:id/notes`
Adds an immutable internal note visible only to staff.
- **Request Body:** `{ "note": "Verified customer corporate identity via telephone call." }`

#### `POST /admin/customers/:id/reset-password`
Generates and dispatches a secure password reset link.

---

### 5.5 Order Processing & Provisioning Engine (`/admin/orders` & `/admin/provisioning`)

#### `GET /admin/orders`
Lists all customer orders with order status, payment status, and provisioning state.

#### `GET /admin/orders/:id`
Retrieves order details, customer snapshot, line items, and linked invoice.

#### `POST /admin/orders/:id/approve-provision`
Approves a pending or awaiting-payment order, triggers automatic server group allocation, creates a new `ProvisioningJob`, and executes it.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_9204",
    "orderStatus": "COMPLETED",
    "provisioningJobId": "job_8842",
    "allocatedServerId": "srv_fra_01",
    "message": "Order approved. Provisioning job dispatched to worker queue."
  }
}
```

#### `POST /admin/orders/:id/cancel`
Cancels an order and voids uncollected invoices.

#### `GET /admin/provisioning/jobs`
Lists all automated provisioning jobs.
- **Query:** `status=FAILED&page=1`

#### `GET /admin/provisioning/jobs/:id`
Retrieves step-by-step audit logs, technical error stack traces, and customer-safe error strings for a provisioning job.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "job_8841",
    "jobCode": "JOB-8841",
    "customerId": "usr_c91a0b3",
    "serviceDomain": "urbanloftdesign.co.uk",
    "provider": "WHM_CPANEL",
    "targetServerName": "FRA-WEB-NODE-01",
    "operation": "CREATE_ACCOUNT",
    "status": "FAILED",
    "currentStep": "CREATE_CPANEL_ACCOUNT",
    "attemptsCount": 1,
    "customerSafeError": "Account setup is taking slightly longer than expected while we configure your server quotas.",
    "internalErrorDetails": "[WHM_API_TIMEOUT] Socket closed by remote host after 15000ms during userdb initialization",
    "steps": [
      { "name": "VALIDATE_ALLOCATION", "status": "COMPLETED" },
      { "name": "CREATE_CPANEL_ACCOUNT", "status": "FAILED", "log": "Socket timeout 15000ms" },
      { "name": "CONFIGURE_DNS_ZONE", "status": "PENDING" },
      { "name": "ISSUE_SSL_CERTIFICATE", "status": "PENDING" },
      { "name": "DISPATCH_WELCOME_EMAIL", "status": "PENDING" }
    ]
  }
}
```

#### `POST /admin/provisioning/jobs/:id/retry`
Re-executes a failed provisioning job idempotently from its point of failure.
- **Header:** `Idempotency-Key: <uuid>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "jobId": "job_8841",
    "status": "RUNNING",
    "message": "Job retry dispatched successfully."
  }
}
```

---

### 5.6 Hosting Services Management (`/admin/services`)

#### `GET /admin/services`
Lists all active hosting containers across the entire infrastructure.

#### `POST /admin/services/:id/suspend`
Suspends an active hosting account via WHM/cPanel or hypervisor API.
- **Request Body:** `{ "reason": "Overdue payment on invoice INV-2026-089" }`

#### `POST /admin/services/:id/unsuspend`
Restores a suspended hosting account.

#### `POST /admin/services/:id/terminate`
Permanently destroys the hosting container and all data. Requires explicit super-admin confirmation.

#### `POST /admin/services/:id/migrate-server`
Triggers an automated live server-to-server migration (cPanel transfer API).
- **Request Body:** `{ "targetServerId": "srv_fra_03" }`

#### `POST /admin/services/:id/change-package`
Upgrades or downgrades resource quotas and changes WHM package in-place.
- **Request Body:** `{ "newProductId": "prod_web_pro" }`

---

### 5.7 Financial Administration: Invoices, Payments & Refunds

#### `GET /admin/invoices`
Lists all customer invoices with status filters (`PAID`, `UNPAID`, `OVERDUE`, `REFUNDED`).

#### `POST /admin/invoices`
Generates a custom manual invoice for a customer.

#### `POST /admin/invoices/:id/apply-credit`
Applies account credit balance to an unpaid invoice.
- **Request Body:** `{ "amount": 25.00, "note": "Promotional loyalty credit applied" }`

#### `POST /admin/invoices/:id/void`
Voids an outstanding or erroneous invoice.

#### `POST /admin/invoices/:id/resend`
Triggers email dispatch of the invoice PDF to the customer via Resend.

#### `GET /admin/payments`
Lists all gateway transactions with raw webhook payloads and processor authorization codes.

#### `POST /admin/payments/:id/refund`
Executes an authorized refund via PayHere or Stripe gateway API, updates the transaction status to `REFUNDED`, updates the corresponding Invoice, and logs a security audit event.
- **Header:** `Idempotency-Key: <uuid>`
- **Access:** Roles: `ADMINISTRATOR`, `BILLING_STAFF` (`STAFF` and `SUPPORT_AGENT` receive `403 Forbidden`)
- **Request Body:**
```json
{
  "amount": 49.00,
  "reason": "Customer requested plan downgrade reversal"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "paymentId": "txn_88412",
    "status": "REFUNDED",
    "refundedAmount": 49.00,
    "refundedAt": "2026-10-27T15:35:00Z",
    "invoiceId": "inv_2026_089",
    "invoiceStatus": "REFUNDED"
  }
}
```

#### `GET /admin/subscriptions`
Lists all active recurring subscriptions with renewal schedules and grace period counters.

#### `POST /admin/subscriptions/:id/retry-renewal`
Manually triggers a recurring card charge attempt for a past-due subscription.

---

### 5.8 Support Tickets & Real-Time Live Chat (`/admin/tickets` & `/admin/live-chat`)

#### `GET /admin/tickets`
Lists support tickets filtered by department, status, or assigned agent.

#### `GET /admin/tickets/:id`
Retrieves support thread including customer messages and private internal staff notes.

#### `POST /admin/tickets/:id/reply`
Posts a message to the support thread.
- **Request Body:**
```json
{
  "content": "Verified via WHM EasyApache4: curl extension was rebuilt and enabled on PHP 8.3.",
  "isInternalNote": true // If true, stored with amber highlight and hidden from customer portal
}
```
- **Response (`201 Created`):** Returns added message object.

#### `PATCH /admin/tickets/:id`
Updates ticket department, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), status (`OPEN`, `WAITING_FOR_CUSTOMER`, `CLOSED`), or reassigns to another staff agent (`assignedAgentId`).

#### `GET /admin/live-chat/sessions`
Lists all active and waiting live chat sessions.

#### `POST /admin/live-chat/sessions/:id/claim`
Claims a waiting live chat session for the authenticated staff agent.

#### `POST /admin/live-chat/sessions/:id/messages`
Sends a real-time message to the customer over live chat.

#### `POST /admin/live-chat/sessions/:id/close`
Resolves and closes a live chat session.

---

### 5.9 Staff Directory & Role-Based Access Control (`/admin/staff`)

#### `GET /admin/staff`
Lists all staff accounts, roles, departments, and active statuses.
- **Access:** `ADMINISTRATOR` only

#### `POST /admin/staff`
Invites a new staff member.
- **Request Body:**
```json
{
  "name": "Marcus Vance",
  "email": "marcus@serversalad.net",
  "role": "SUPPORT_AGENT", // "ADMINISTRATOR" | "STAFF" | "SUPPORT_AGENT" | "BILLING_STAFF"
  "department": "Technical Support"
}
```

#### `PATCH /admin/staff/:id/role`
Changes a staff member's administrative role.

#### `PATCH /admin/staff/:id/status`
Toggles staff account active/deactivated state.

---

### 5.10 System Audit Logs & Global Settings (`/admin/audit-logs` & `/admin/settings`)

#### `GET /admin/audit-logs`
Queries the immutable administrative security audit trail.
- **Query:** `actor=admin@serversalad.net&resourceType=PAYMENT&page=1`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "audit_99182",
      "timestamp": "2026-10-27T15:35:01Z",
      "actor": "admin@serversalad.net",
      "actorRole": "ADMINISTRATOR",
      "action": "EXECUTE_REFUND",
      "resourceType": "PAYMENT",
      "resourceId": "txn_88412",
      "outcome": "SUCCESS",
      "details": "Authorized refund of $49.00 USD processed for payment txn_88412. Reason: Customer requested plan downgrade reversal."
    }
  ]
}
```

#### `GET /admin/settings`
Retrieves global integration configs for WHM, VPS hypervisors, PayHere gateway, and Resend email service.

#### `PATCH /admin/settings`
Updates integration credentials, timeout thresholds, tax rates, or maintenance mode.

---

## 6. External Webhooks & Real-Time Specifications

### 6.1 Payment Gateway Webhooks (`/webhooks`)

#### `POST /webhooks/payhere`
Ingests PayHere payment settlement notifications.
- **Verification:** HMAC-MD5 signature verification over `merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5_secret`.
- **Payload:**
```json
{
  "merchant_id": "1224890",
  "order_id": "ORD-9204",
  "payment_id": "320025184910",
  "payhere_amount": "458.00",
  "payhere_currency": "LKR",
  "status_code": "2", // 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed, -3 = Chargedback
  "md5sig": "E4D909C290D0FB1CA068FFADD...",
  "custom_1": "usr_alex_01",
  "custom_2": "inv_88129"
}
```
- **Action:** Updates Invoice to `PAID`, records `PaymentTransaction`, and triggers `ProvisioningJob`.

#### `POST /webhooks/stripe`
Ingests Stripe events (`payment_intent.succeeded`, `charge.refunded`, `invoice.payment_failed`).
- **Verification:** `Stripe-Signature` cryptographic header verification using webhook signing secret.

---

### 6.2 Real-Time WebSocket Protocols

#### WebSocket URL: `wss://api.serversalad.com/ws`

#### 1. Live Support Chat (`/ws/live-chat`)
- **Client Connect Query:** `wss://api.serversalad.com/ws/live-chat?token=<jwt>`
- **Client -> Server Events:**
  - `join_session`: `{ "sessionId": "chat_01" }`
  - `send_message`: `{ "sessionId": "chat_01", "text": "Hello, my domain is not pointing yet." }`
  - `typing`: `{ "sessionId": "chat_01", "isTyping": true }`
- **Server -> Client Events:**
  - `message_received`: `{ "id": "msg_90", "sender": "AGENT", "text": "...", "timestamp": "..." }`
  - `agent_claimed`: `{ "sessionId": "chat_01", "agentName": "Sarah Jenkins" }`
  - `session_closed`: `{ "sessionId": "chat_01" }`

#### 2. Provisioning Status Updates (`/ws/provisioning`)
- **Client Connect Query:** `wss://api.serversalad.com/ws/provisioning?jobId=job_8841`
- **Server -> Client Events:**
  - `step_progress`:
  ```json
  {
    "jobId": "job_8841",
    "stepName": "CREATE_CPANEL_ACCOUNT",
    "status": "RUNNING"
  }
  ```
  - `job_completed`:
  ```json
  {
    "jobId": "job_8841",
    "status": "SUCCEEDED",
    "service": {
      "id": "srv_41029",
      "primaryDomain": "nodegen.com",
      "serverIp": "198.51.100.42"
    }
  }
  ```
  - `job_failed`:
  ```json
  {
    "jobId": "job_8841",
    "status": "FAILED",
    "customerSafeError": "Account setup is taking slightly longer than expected while we configure your server quotas."
  }
  ```

---

## 7. Complete TypeScript Interface Definitions (Shared DTOs)

```typescript
// Shared Enums
export type StaffRole = 'ADMINISTRATOR' | 'STAFF' | 'SUPPORT_AGENT' | 'BILLING_STAFF';
export type ServerProvider = 'WHM_CPANEL' | 'PROXMOX_KVM' | 'HETZNER_CLOUD' | 'AWS_EC2';
export type ServerType = 'SHARED_HOSTING' | 'VPS_NODE' | 'DEDICATED';
export type ServerHealthStatus = 'ONLINE' | 'MAINTENANCE' | 'DEGRADED' | 'OFFLINE';
export type ProductType = 'SHARED' | 'VPS';
export type CustomerStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type OrderStatus = 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'VOIDED';
export type ServiceStatus = 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
export type ProvisioningJobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
export type ProvisioningOperation = 'CREATE_ACCOUNT' | 'SUSPEND_ACCOUNT' | 'UNSUSPEND_ACCOUNT' | 'TERMINATE_ACCOUNT' | 'UPGRADE_PACKAGE';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'WAITING_FOR_STAFF' | 'CLOSED';
export type TicketDepartment = 'TECHNICAL_SUPPORT' | 'BILLING' | 'INFRASTRUCTURE' | 'SALES';

// Standard API Response DTO
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  error: string;
  message: string;
  details?: Array<{ field: string; issue: string }>;
  path: string;
}
```
