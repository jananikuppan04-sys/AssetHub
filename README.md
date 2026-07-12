<div align="center">

# AssetHub

### AI-Powered Enterprise Asset & Resource Management Platform

Track assets, prevent allocation conflicts, manage shared resources, automate maintenance workflows, conduct structured audits, and obtain operational insights from one secure ERP platform.

[![React](https://img.shields.io/badge/React-TypeScript-0F172A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-0F172A?logo=fastapi&logoColor=009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-0F172A?logo=postgresql&logoColor=4169E1)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-0F172A?logo=docker&logoColor=2496ED)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981.svg)](LICENSE)

<!-- Replace the placeholders below after deployment. -->
[Live Demo](https://YOUR_DEPLOYED_URL) · [API Documentation](https://YOUR_API_URL/docs) · [Report a Bug](https://github.com/YOUR_USERNAME/AssetHub/issues)

</div>

---

> **Development status:** AssetHub is under active development. The architecture and workflows documented here represent the intended production-ready system. Update the feature status and deployment links as modules are completed.

## Table of contents

- [Overview](#overview)
- [Problem and solution](#problem-and-solution)
- [Core capabilities](#core-capabilities)
- [Roles and permissions](#roles-and-permissions)
- [Business workflows](#business-workflows)
- [System architecture](#system-architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Database and demo data](#database-and-demo-data)
- [API documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

AssetHub is a centralized Enterprise Asset and Resource Management platform for organizations that manage equipment, furniture, vehicles, rooms, projectors, and other shared resources.

It replaces fragmented spreadsheets and paper-based tracking with structured asset lifecycles, role-based approvals, conflict-safe allocations, resource booking, maintenance operations, scheduled audits, real-time notifications, analytics, and an authorization-aware AI assistant.

AssetHub is industry-neutral and can serve:

- Offices and technology companies
- Colleges and schools
- Hospitals and laboratories
- Factories and warehouses
- Government agencies
- NGOs and distributed field teams

AssetHub deliberately excludes purchasing, invoicing, payroll, and accounting. Its focus is operational control after an asset enters the organization.

## Problem and solution

### The problem

Organizations frequently lose visibility into:

- Who currently holds an asset
- Whether an asset is available, reserved, damaged, lost, or under maintenance
- When an allocated asset should be returned
- Whether a shared room, vehicle, or device is already booked
- Which maintenance requests require approval
- Which audit items are missing or damaged
- Which departments have idle or overused assets

Manual processes cause duplicate allocations, booking conflicts, missed maintenance, overdue returns, inaccurate audits, and weak accountability.

### The AssetHub solution

AssetHub provides one source of truth with:

- Unique asset tags, QR codes, and barcodes
- Complete lifecycle and ownership history
- Concurrency-safe allocation and booking validation
- Multi-level approval workflows
- Automated reminders and overdue alerts
- Immutable activity records
- Operational dashboards and exportable reports
- Permission-aware natural-language search and recommendations

## Core capabilities

### Authentication and access control

- Secure email and password authentication
- Forgot-password and reset-password flows
- Short-lived access tokens and rotating refresh sessions
- Role-Based Access Control enforced by both frontend and backend
- New registrations always receive the **Employee** role
- Only an Admin can assign privileged roles

### Organization setup

- Department creation and hierarchy management
- Department Head assignment
- Dynamic asset categories and custom fields
- Warranty and maintenance defaults by category
- Searchable employee directory
- Role, department, and active-status management

### Asset management

- Concurrency-safe Asset ID generation, such as `AH-0001`
- QR code and barcode generation
- Photos and supporting documents
- Category-specific metadata
- Condition, location, warranty, and bookable status
- Complete allocation, maintenance, audit, and lifecycle timeline

### Allocation, transfer, and return

- Employee or department allocation
- Optional expected-return date
- Double-allocation prevention
- Current-holder visibility when an asset is unavailable
- Department Head and Asset Manager transfer approvals
- Return inspection with condition notes and evidence
- Automated overdue detection and reminders

### Resource booking

- Calendar-based booking for rooms, halls, vehicles, projectors, and shared equipment
- Day, week, month, agenda, and resource views
- Backend-enforced overlap prevention
- Cancel and reschedule support
- Booking reminders and time-based status updates

### Maintenance

- Employee-raised maintenance requests
- Priority, issue details, photos, and documents
- Approval and rejection by Asset Manager
- Technician assignment and progress tracking
- Automatic asset lifecycle updates
- Resolution notes and complete maintenance history

### Asset audits

- Department- or location-based audit cycles
- Multiple auditor assignments
- QR and barcode-assisted verification
- Verified, Missing, and Damaged outcomes
- Auto-generated discrepancy reports
- Locked audit records after closure
- Audited transition of confirmed missing assets to Lost

### Analytics and reports

- Asset utilization
- Department allocation
- Maintenance trends and frequency
- Asset health and lifecycle
- Idle assets
- Warranty expiry
- Resource booking heatmaps
- Audit discrepancies
- Overdue returns
- PDF, XLSX, and CSV export

### AssetHub AI

- Natural-language asset search
- Permission-aware operational questions
- Predictive maintenance recommendations
- Smart allocation suggestions
- Executive summaries
- Anomaly detection
- Explainable asset health score
- Record-level citations and deep links

Example questions:

```text
Who currently has Laptop AH-0124?
Show all overdue assets in the Engineering department.
Which department has the most idle assets?
Summarize high-risk maintenance items for this month.
```

## Roles and permissions

| Capability | Admin | Asset Manager | Department Head | Employee |
| --- | :---: | :---: | :---: | :---: |
| Manage departments and categories | ✅ | — | — | — |
| Manage employee directory | ✅ | — | — | — |
| Assign privileged roles | ✅ | — | — | — |
| View organization-wide analytics | ✅ | ✅ | — | — |
| Register and edit assets | Configurable | ✅ | — | — |
| Allocate assets | Configurable | ✅ | Request | — |
| Approve department transfers | — | Final approval | ✅ | — |
| Initiate transfer or return | — | ✅ | ✅ | ✅ |
| Verify returned condition | — | ✅ | — | — |
| Book shared resources | ✅ | ✅ | ✅ | ✅ |
| Raise maintenance request | ✅ | ✅ | ✅ | ✅ |
| Approve maintenance | — | ✅ | — | — |
| Create and close audit cycles | ✅ | Configurable | — | — |
| Perform assigned audits | Assigned | Assigned | Assigned | Assigned |
| View activity logs | Organization | Operational | Department | Own activity |

> Backend policies enforce every permission and object-level scope. UI visibility alone is never treated as authorization.

## Business workflows

### Asset lifecycle

```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> Allocated: Allocate
    Available --> Reserved: Reserve or book
    Available --> UnderMaintenance: Approve maintenance
    Allocated --> Available: Complete return
    Allocated --> UnderMaintenance: Approve repair
    Reserved --> Available: Cancel or complete booking
    UnderMaintenance --> Available: Resolve maintenance
    Available --> Retired: Retire
    Retired --> Disposed: Dispose
    Available --> Lost: Confirm missing
    Allocated --> Lost: Confirm missing
```

Asset status cannot be edited arbitrarily. Every transition passes through a validated lifecycle service and produces history and activity records.

### Transfer approval

```mermaid
flowchart TD
    A[Employee requests transfer] --> B[Department Head review]
    B -->|Reject| X[Rejected with reason]
    B -->|Approve| C[Asset Manager review]
    C -->|Reject| X
    C -->|Approve| D[Ownership updated atomically]
    D --> E[History and notifications updated]
```

### Return workflow

```mermaid
flowchart TD
    A[Employee requests return] --> B[Inspection pending]
    B --> C[Asset Manager verifies condition]
    C -->|Accepted| D[Allocation closed]
    C -->|Needs repair| E[Maintenance process]
    D --> F[Asset becomes available]
```

### Maintenance workflow

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Approved: Approve
    Pending --> Rejected: Reject
    Approved --> TechnicianAssigned: Assign technician
    TechnicianAssigned --> InProgress: Start work
    InProgress --> Resolved: Complete repair
    Resolved --> [*]
    Pending --> Cancelled: Cancel
```

When maintenance is approved, the asset moves to `UNDER_MAINTENANCE`. Resolution restores the correct eligible lifecycle state through a transactional business rule.

### Booking conflict rule

For the same resource:

- `09:00-10:00` and `09:30-10:30` conflict and must be rejected.
- `09:00-10:00` and `10:00-11:00` are adjacent and valid.

Validation runs on the backend inside a concurrency-safe transaction.

## System architecture

```mermaid
flowchart TD
    U[Web and mobile browser] --> F[React application]
    F --> A[FastAPI REST and WebSocket API]
    A --> P[(PostgreSQL and pgvector)]
    A --> R[(Redis)]
    A --> S[(S3 or MinIO storage)]
    R --> W[Celery background workers]
    W --> P
    W --> S
    A --> L[Configurable LLM provider]
```

### Architectural principles

- Modular feature boundaries
- API versioning under `/api/v1`
- DTOs separated from database models
- Repository and service layers
- Explicit transaction boundaries
- Backend-enforced policies and object-level authorization
- Asynchronous processing for reminders and large exports
- Provider abstraction for AI and object storage
- Structured logging and correlation IDs

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Navigation | React Router |
| Server state | TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Tables and charts | TanStack Table, Recharts |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Database | PostgreSQL, pgvector, Alembic |
| Cache and jobs | Redis, Celery |
| Realtime | WebSockets |
| File storage | S3-compatible storage, MinIO locally |
| Authentication | JWT access tokens, rotating refresh sessions, Argon2id |
| Testing | Pytest, Vitest, React Testing Library, Playwright |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Project structure

```text
AssetHub/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── tests/
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   ├── ai/
│   │   ├── core/
│   │   ├── db/
│   │   ├── exports/
│   │   ├── jobs/
│   │   ├── models/
│   │   ├── policies/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tests/
│   ├── alembic/
│   └── Dockerfile
├── docs/
├── infra/
├── .env.example
├── docker-compose.yml
├── LICENSE
└── README.md
```

Adapt this tree to the actual repository. Do not create duplicate nested frontend or backend directories.

## Getting started

### Prerequisites

Install:

- Git
- Docker Desktop with Docker Compose
- Node.js 20+ for manual frontend development
- Python 3.12+ for manual backend development
- PostgreSQL 16+ only when not using Docker

### Recommended: Docker Compose

```bash
git clone https://github.com/YOUR_USERNAME/AssetHub.git
cd AssetHub
cp .env.example .env
docker compose up --build
```

After the containers become healthy:

| Service | Default URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8000` |
| Swagger UI | `http://localhost:8000/docs` |
| ReDoc | `http://localhost:8000/redoc` |
| MinIO Console | `http://localhost:9001` |

Stop the environment:

```bash
docker compose down
```

Remove local containers and development volumes only when a clean reset is required:

```bash
docker compose down -v
```

> The `-v` command deletes the local Docker database and stored development files. Do not run it when you need to preserve local data.

### Manual frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Manual backend setup

```bash
cd backend
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS or Linux
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Start the background worker in another terminal:

```bash
celery -A app.jobs.worker worker --loglevel=info
```

## Environment configuration

Copy `.env.example` to `.env` and configure values for your environment.

```env
APP_NAME=AssetHub
APP_ENV=development
APP_URL=http://localhost:5173
API_URL=http://localhost:8000

DATABASE_URL=postgresql+psycopg://assethub:change_me@postgres:5432/assethub
REDIS_URL=redis://redis:6379/0

JWT_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

CORS_ORIGINS=http://localhost:5173

S3_ENDPOINT=http://minio:9000
S3_BUCKET=assethub
S3_ACCESS_KEY=change_me
S3_SECRET_KEY=change_me

LLM_PROVIDER=disabled
LLM_API_KEY=
LLM_MODEL=

VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
```

Never commit `.env`, credentials, access tokens, production URLs containing secrets, or private keys.

## Database and demo data

Run migrations:

```bash
cd backend
alembic upgrade head
```

Create a migration after changing database models:

```bash
alembic revision --autogenerate -m "describe the schema change"
alembic upgrade head
```

Load local demo data:

```bash
python -m app.db.seed
```

The seed should include connected example data for all roles, departments, lifecycle states, allocations, bookings, maintenance stages, audit discrepancies, notifications, and reports.

Document demo credentials in development output or a dedicated non-production file. Never enable known demo passwords in production.

## API documentation

When the backend is running:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI schema: `http://localhost:8000/openapi.json`
- Health endpoint: `http://localhost:8000/health`
- Readiness endpoint: `http://localhost:8000/ready`

All product endpoints are versioned under:

```text
/api/v1
```

Standard API errors use this structure:

```json
{
  "code": "ASSET_ALREADY_ALLOCATED",
  "message": "This asset is currently allocated.",
  "details": {},
  "correlationId": "request-correlation-id"
}
```

## Testing

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
```

### End-to-end

```bash
cd frontend
npx playwright install
npm run test:e2e
```

Critical tests cover:

- Employee-only signup
- Privilege-escalation prevention
- Unique Asset ID generation
- Concurrent double-allocation rejection
- Transfer and return approvals
- Booking overlap rejection and adjacent-slot acceptance
- Maintenance and asset state synchronization
- Immutable audit closure
- Permission-scoped AI retrieval
- Filtered report exports

## Security

AssetHub’s security baseline includes:

- Argon2id password hashing
- Short-lived access tokens
- Rotating refresh sessions and revocation
- Secure HttpOnly cookies where supported
- CSRF protection for cookie-based authentication
- Rate limiting on authentication and recovery endpoints
- RBAC and object-level authorization
- Input validation and parameterized database access
- Restricted CORS and secure response headers
- Private object storage with expiring signed URLs
- Upload validation by permission, MIME type, extension, and size
- Secret and sensitive-field redaction in logs
- Immutable audit trails for important business actions
- AI tool allowlisting and authorization-aware retrieval

Please report security issues privately to `YOUR_SECURITY_EMAIL` rather than opening a public issue.

## Deployment

A production deployment requires:

- Static frontend hosting or a container platform
- FastAPI API container
- Celery worker container
- Managed PostgreSQL with backups and `pgvector`
- Managed Redis
- Private S3-compatible object storage
- TLS, secure cookies, restricted CORS, and production secrets
- Database migration step before application rollout
- Health checks, structured logs, monitoring, and alerting

Recommended deployment split:

| Component | Example target |
| --- | --- |
| Frontend | Vercel, Cloudflare Pages, or container hosting |
| API and worker | Railway, Render, Google Cloud Run, AWS, or Azure |
| PostgreSQL | Managed PostgreSQL provider |
| Redis | Managed Redis provider |
| File storage | S3, Cloudflare R2, or compatible private storage |

Do not use the local MinIO credentials or development secrets in production.

## Roadmap

### Foundation

- [ ] Authentication and secure sessions
- [ ] RBAC and organization setup
- [ ] Asset registration and directory
- [ ] Asset history, QR code, and barcode

### Operational workflows

- [ ] Allocation and conflict prevention
- [ ] Transfer and return approvals
- [ ] Shared-resource booking
- [ ] Maintenance workflow
- [ ] Audit cycles and discrepancies

### Intelligence and scale

- [ ] Real-time notifications
- [ ] Reports and asynchronous exports
- [ ] AssetHub AI natural-language search
- [ ] Explainable health scoring
- [ ] Predictive maintenance and anomaly detection
- [ ] Accessibility and performance audit
- [ ] Production deployment and monitoring

Update this checklist honestly as features are completed and tested.

## Contributing

1. Create or select an issue before major work.
2. Create a feature branch from the latest `main`.
3. Use focused commits with meaningful messages.
4. Run lint, type checks, tests, and the production build.
5. Open a pull request with screenshots and testing evidence.
6. Resolve review comments before merging.
7. Use **Squash and merge** to keep `main` history clean.

Example:

```bash
git checkout main
git pull origin main
git checkout -b feature/asset-registration

# Make and test the change
git add .
git commit -m "feat: add asset registration workflow"
git push -u origin feature/asset-registration
```

Recommended repository settings:

- Protect the `main` branch.
- Require pull requests before merging.
- Require at least one approval.
- Require CI checks to pass.
- Enable squash merging.
- Keep automatic merging disabled for the hackathon team unless the review and CI process is mature.

## License

This project is licensed under the [MIT License](LICENSE). Add a `LICENSE` file before publishing if one is not already present.

## Acknowledgements

AssetHub’s product and interface direction is inspired by established enterprise platforms such as Odoo, SAP Fiori, Oracle Fusion, and Microsoft Dynamics 365. AssetHub is an independent project and is not affiliated with those products or companies.

---

<div align="center">

**AssetHub - Know what you own, where it is, and what it needs.**

If this project is useful, consider giving the repository a star.

</div>
