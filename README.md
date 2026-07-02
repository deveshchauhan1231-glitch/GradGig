# GradGig

A freelance marketplace built exclusively for students — post gigs, find student freelancers, and get work done within your own campus/student ecosystem.

> GradGig does not process payments. It is a discovery and collaboration platform; payment terms are settled directly between students.
> <img width="1896" height="917" alt="image" src="https://github.com/user-attachments/assets/0d6e0899-9a0b-4445-ab54-4b92b0bd815a" />


---

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

GradGig connects students who need small freelance jobs done (design, coding, writing, editing, tutoring, etc.) with fellow students who can do them — at student-friendly rates, within a trusted, verified student community.

The platform focuses on:
- **Trust** — identity and student status handled through Clerk auth
- **Speed** — Redis-backed caching for fast gig browsing and search
- **Simplicity** — no payment processing, no unnecessary friction between posting a gig and getting responses

## Features

- **Authentication** — Clerk-based sign up/sign in, synced to MongoDB via webhooks
- **Gig posting** — structured "Post a Gig" flow with budget, deadline, and skill tags
- **Gig browsing** — searchable, filterable gig listings
- **How it works** — onboarding page explaining the platform flow for new users
- **Caching layer** — Redis caching for frequently accessed gig data to reduce DB load
- **Responsive UI** — built with Tailwind CSS v4

### Planned / in-progress (ML features)

- **Budget prediction** — estimate a fair gig budget from title/description (LightGBM, best-performing model so far)
- **Difficulty estimation** — classify gigs by effort/complexity
- **Fraud detection** — flag suspicious postings or accounts
- **Proposal writer assistant** — help freelancers draft stronger proposals

## Tech stack

**Frontend**
- React (with React Router)
- Tailwind CSS v4

**Backend**
- Node.js / Express
- MongoDB (primary data store)
- Redis (caching layer)

**Auth**
- Clerk (webhook-synced to MongoDB)

**ML (in progress)**
- Python, LightGBM, scikit-learn

## Architecture

```
Client (React + Tailwind)
        │
        ▼
  Express API server
   │           │
   ▼           ▼
MongoDB      Redis (cache)
   ▲
   │
Clerk (auth) ── webhooks ──▶ user sync
```

## Getting started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Redis instance (local or hosted, e.g. Upstash)
- Clerk account (API keys + webhook secret)

### Installation

```bash
# clone the repo
git clone https://github.com/<your-username>/gradgig.git
cd gradgig

# install backend dependencies
cd server
npm install

# install frontend dependencies
cd ../client
npm install
```

### Running locally

```bash
# start backend (from /server)
npm run dev

# start frontend (from /client)
npm run dev
```

The client will run on `http://localhost:5173` (Vite default) and the server on `http://localhost:5000` (adjust based on your config).

## Environment variables

Create a `.env` file in `/server`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

Create a `.env` file in `/client`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000
```

## Project structure

```
gradgig/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
├── server/                # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── webhooks/          # Clerk webhook handlers
│   └── ...
└── README.md
```

## Roadmap

- [ ] Integrate budget prediction model into gig posting flow
- [ ] Add difficulty estimation tags to gig listings
- [ ] Ship fraud detection pipeline for new postings
- [ ] Launch proposal writer assistant
- [ ] Expand search/filter capabilities

## Contributing

This is currently a solo-built project. Issues and suggestions are welcome — feel free to open an issue if you spot a bug or have a feature idea.

## License

GNU general public license v3

---

Built solo by [Devesh](https://github.com/<your-username>) as a full-stack + ML project.
