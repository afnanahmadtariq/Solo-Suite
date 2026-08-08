# Solo Suite API — Routes & Frontend Validation Guide

**Base URL**: `http://localhost:3000/api`

All routes (except `health`, `auth/register`, `auth/login`) require:
**Header**: `Authorization: Bearer <token>`

---

## ⚕️ Health Check

### `GET /health`

- **Auth**: None
- **Returns**: `{ "status": "ok", "timestamp": "..." }`

---

## 🔒 Authentication (`/api/auth`)

### `POST /auth/register`

| Field      | Type     | Required | Validation                                                 |
| ---------- | -------- | -------- | ---------------------------------------------------------- |
| `name`     | `string` | ✅ Yes   | Must not be empty                                          |
| `email`    | `string` | ✅ Yes   | Must be valid email format, must be unique (server checks) |
| `password` | `string` | ✅ Yes   | Must not be empty (recommend ≥ 6 characters)               |

**Error Responses**:

- `400` — Missing fields or email already registered
- `500` — Server error

---

### `POST /auth/login`

| Field      | Type     | Required | Validation        |
| ---------- | -------- | -------- | ----------------- |
| `email`    | `string` | ✅ Yes   | Must not be empty |
| `password` | `string` | ✅ Yes   | Must not be empty |

**Error Responses**:

- `400` — Missing fields
- `401` — Invalid credentials (wrong email or password)

---

### `GET /auth/me`

- **Auth**: Bearer token
- **Returns**: `{ id, email, name }`

---

### `PUT /auth/me` — Update Profile

| Field   | Type     | Required        | Validation                                          |
| ------- | -------- | --------------- | --------------------------------------------------- |
| `name`  | `string` | ⚠️ At least one | Must not be empty if provided                       |
| `email` | `string` | ⚠️ At least one | Must be valid email, must be unique (server checks) |

> ⚠️ At least one of `name` or `email` must be provided. Sending `{}` returns `400`.

**Error Responses**:

- `400` — No fields provided, or email already in use
- `401` — Invalid/missing token

---

### `DELETE /auth/me` — Delete Account

- **Auth**: Bearer token
- **Request Body**: None
- **Returns**: `204 No Content`
- ⚠️ **Destructive**: Permanently deletes user + all their clients, projects, invoices, and leads (cascade)

---

## 👤 Clients (`/api/clients`)

### `POST /clients` — Create Client

| Field     | Type     | Required | Validation                                                                                                           |
| --------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `name`    | `string` | ✅ Yes   | Must not be empty                                                                                                    |
| `company` | `string` | ✅ Yes   | Must not be empty                                                                                                    |
| `email`   | `string` | ✅ Yes   | Must not be empty (recommend valid email format)                                                                     |
| `phone`   | `string` | ✅ Yes   | Must not be empty                                                                                                    |
| `status`  | `string` | ❌ No    | Defaults to `"Active"`. Suggested values: `"Active"`, `"Inactive"`                                                   |
| `leadId`  | `number` | ❌ No    | If provided, must be the ID of an **existing Lead** that is not already linked to another Client (unique constraint) |

**⚠️ Foreign Key Constraints**:

- `leadId` → Must reference an existing Lead. If the Lead doesn't exist → `500` error

**Error Responses**:

- `500` — Missing required fields, invalid leadId, or server error

---

### `PUT /clients/:id` — Update Client

Same fields as `POST /clients`. The `:id` in the URL must be a valid integer for an existing client owned by the user.

**Error Responses**:

- `404` — Client not found (wrong ID or not owned by user)

---

### `DELETE /clients/:id`

- `:id` must be a valid integer
- ⚠️ **Cascade**: Deleting a client also deletes all their **Projects** and **Invoices**
- **Returns**: `{ "message": "Client deleted" }`

---

## 🏗️ Projects (`/api/projects`)

### `POST /projects` — Create Project

| Field      | Type     | Required | Validation                                                                                     |
| ---------- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `name`     | `string` | ✅ Yes   | Must not be empty                                                                              |
| `clientId` | `number` | ✅ Yes   | **Must be the ID of an existing Client owned by the user**                                     |
| `status`   | `string` | ❌ No    | Defaults to `"Planning"`. Suggested: `"Planning"`, `"In Progress"`, `"Completed"`, `"On Hold"` |
| `progress` | `number` | ❌ No    | Defaults to `0`. Should be integer between `0` and `100`                                       |
| `dueDate`  | `string` | ✅ Yes   | Must not be empty. Use ISO 8601 format: `"2025-12-31"`                                         |

**⚠️ Foreign Key Constraints**:

- `clientId` → **Must reference an existing Client**. If the Client doesn't exist or doesn't belong to the user → `500` error with `P2003` (this is the error you just encountered!)

**Frontend must**:

1. Fetch clients first (`GET /clients`) to populate a dropdown
2. Use the `id` from the selected client as `clientId`
3. Never allow manual typing of `clientId` — always use a select/dropdown

**Error Responses**:

- `500` — Invalid clientId (FK violation) or missing required fields

---

### `PUT /projects/:id` — Update Project

Same fields as `POST /projects`. The `:id` must be valid.

**Error Responses**:

- `404` — Project not found

---

### `DELETE /projects/:id`

- `:id` must be a valid integer
- ⚠️ **Cascade**: Deleting a project sets `projectId = null` on linked invoices (SetNull)
- **Returns**: `{ "message": "Project deleted" }`

---

## 💰 Invoices (`/api/invoices`)

### `POST /invoices` — Create Invoice

| Field       | Type     | Required | Validation                                                                                    |
| ----------- | -------- | -------- | --------------------------------------------------------------------------------------------- |
| `number`    | `string` | ✅ Yes   | Must not be empty. E.g., `"INV-1001"`                                                         |
| `clientId`  | `number` | ✅ Yes   | **Must be the ID of an existing Client owned by the user**                                    |
| `projectId` | `number` | ❌ No    | If provided, **must be the ID of an existing Project** (ideally belonging to the same Client) |
| `date`      | `string` | ✅ Yes   | Must not be empty. Use ISO 8601: `"2025-10-15"`                                               |
| `amount`    | `number` | ✅ Yes   | Must be a number > 0 (Float)                                                                  |
| `status`    | `string` | ❌ No    | Defaults to `"Pending"`. Suggested: `"Pending"`, `"Paid"`, `"Overdue"`                        |

**⚠️ Foreign Key Constraints**:

- `clientId` → Must reference an existing Client → `500` if invalid
- `projectId` → Must reference an existing Project → `500` if invalid

**Frontend must**:

1. Fetch clients first (`GET /clients`) and projects (`GET /projects`) for dropdowns
2. Ideally filter projects by the selected `clientId`
3. Never allow manual ID entry — always use select/dropdown controls

**Error Responses**:

- `500` — Invalid clientId/projectId (FK violation) or missing fields

---

### `PUT /invoices/:id` — Update Invoice

Same fields as `POST /invoices`.

**Error Responses**:

- `404` — Invoice not found

---

### `PATCH /invoices/:id/status` — Update Status Only

| Field    | Type     | Required | Validation                                    |
| -------- | -------- | -------- | --------------------------------------------- |
| `status` | `string` | ✅ Yes   | Suggested: `"Pending"`, `"Paid"`, `"Overdue"` |

---

### `DELETE /invoices/:id`

- **Returns**: `{ "message": "Invoice deleted" }`

---

## 🎯 Leads (`/api/leads`)

### `POST /leads` — Create Lead

| Field     | Type     | Required | Validation                                                                               |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `title`   | `string` | ✅ Yes   | Must not be empty                                                                        |
| `company` | `string` | ✅ Yes   | Must not be empty                                                                        |
| `name`    | `string` | ❌ No    | Contact person name (nullable)                                                           |
| `email`   | `string` | ❌ No    | Contact email (nullable, recommend valid format if provided)                             |
| `phone`   | `string` | ❌ No    | Contact phone (nullable)                                                                 |
| `value`   | `number` | ✅ Yes   | Pipeline value, must be a number ≥ 0 (Float)                                             |
| `status`  | `string` | ❌ No    | Defaults to `"New"`. Suggested: `"New"`, `"Contacted"`, `"Qualified"`, `"Won"`, `"Lost"` |
| `type`    | `string` | ✅ Yes   | Must not be empty. E.g., `"Inbound Organic"`, `"Referral"`, `"Cold Outreach"`            |

**Error Responses**:

- `500` — Missing required fields or server error

---

### `PUT /leads/:id` — Update Lead

Same fields as `POST /leads`.

**Error Responses**:

- `404` — Lead not found

---

### `PATCH /leads/:id/status` — Update Status Only

| Field    | Type     | Required | Validation                                                          |
| -------- | -------- | -------- | ------------------------------------------------------------------- |
| `status` | `string` | ✅ Yes   | Suggested: `"New"`, `"Contacted"`, `"Qualified"`, `"Won"`, `"Lost"` |

---

### `DELETE /leads/:id`

- **Returns**: `{ "message": "Lead deleted" }`

---

## 📊 Dashboard (`/api/dashboard`)

### `GET /dashboard/stats`

- **Auth**: Bearer token
- **Returns**: Overview metrics (client count, project count, invoice totals, leads won, pending amounts)

---

## 🔑 Summary of ALL Foreign Key Rules

| When Creating/Updating | Field       | Must Reference              | What Happens if Invalid       |
| ---------------------- | ----------- | --------------------------- | ----------------------------- |
| **Project**            | `clientId`  | Existing `Client.id`        | `500` — FK constraint `P2003` |
| **Invoice**            | `clientId`  | Existing `Client.id`        | `500` — FK constraint `P2003` |
| **Invoice**            | `projectId` | Existing `Project.id`       | `500` — FK constraint `P2003` |
| **Client**             | `leadId`    | Existing `Lead.id` (unique) | `500` — FK constraint `P2003` |

### 🛡️ Frontend Best Practices

1. **Always use dropdowns/selects** for `clientId`, `projectId`, and `leadId` — never let users type IDs manually
2. **Fetch fresh data** before showing create/edit forms (clients list may have changed)
3. **Validate required fields** before sending the request (show inline errors)
4. **Validate number fields** — `amount`, `value`, `progress` must be actual numbers, not strings
5. **Handle `401` globally** — redirect to login when token expires
6. **Handle `404`** — show "not found" message if a record was deleted by another session
7. **Confirm destructive actions** — especially `DELETE /auth/me` (account deletion) and `DELETE /clients/:id` (cascades to projects & invoices)
