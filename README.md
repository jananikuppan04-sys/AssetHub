# AssetHub Enterprise ERP

AssetHub is a production-ready Enterprise Asset Management ERP with AI-powered features capable of managing thousands of users and assets.

## Core Features
*   **AI Asset Assistant:** Natural language querying for maintenance, warranty, and analytical insights.
*   **Predictive Maintenance:** Calculates risk scores based on asset age, condition, and maintenance frequency.
*   **Warranty Engine:** Automated cron jobs that monitor warranty expiration and emit alerts.
*   **Asset Health Engine:** Auto-calculates 0-100 health scores based on asset history and state.
*   **Advanced Analytics:** Generates department, category, and historical metric aggregation pipelines.
*   **Real-time Infrastructure:** Utilizes `Socket.io` for live web-socket broadcast notifications.
*   **Email Notifications:** `Nodemailer` integration for allocation and maintenance approvals.
*   **Security & Caching:** Helmet, XSS-Clean, Mongo-Sanitize, CORS, Express-Rate-Limit, and Redis.
*   **DevOps Ready:** Dockerized, GitHub Actions CI/CD, Jest test suites.

## Getting Started

### Prerequisites
*   Node.js v18+
*   MongoDB
*   Redis

### Installation
1.  Clone the repository
2.  Install dependencies: `npm install`
3.  Set up environment variables in `.env` (MONGO_URI, JWT_SECRET, REDIS_URL, SMTP_*, FRONTEND_URL).
4.  Run development server: `npm run dev`

### Docker Deployment
```bash
docker-compose up -d --build
```
This will launch the Node backend, a MongoDB instance, and a Redis container.

### Testing
Run the Jest test suite:
```bash
npm test
```

## Architecture
The backend strictly adheres to Clean Architecture:
Routes -> Controllers -> Services -> Repositories -> Mongoose Models.

Business logic is strictly isolated in the Services layer.
