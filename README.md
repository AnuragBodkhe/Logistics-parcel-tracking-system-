# LogiTrack — Logistics Parcel Tracking System

LogiTrack is a modern parcel tracking and logistics management application built with React, TypeScript, and Vite. It provides a public shipment tracking experience and an admin workspace for managing parcels, users, agents, and analytics.

## Features

- Public parcel tracking by tracking ID
- Admin dashboard with shipment overview metrics
- Create, edit, and manage parcel records
- Shipment status timeline and history updates
- Delivery agent management and assignment support
- User management and analytics pages
- In-app notifications for shipment changes
- Persistent data using browser local storage (demo-friendly)

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Styling/UI:** Tailwind CSS, Lucide Icons, Motion
- **Utilities:** date-fns
- **Tooling:** npm, TypeScript compiler
- **Containerization:** Docker, Docker Compose, Makefile workflows

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Type Check

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Demo Access

Admin login credentials:

- **Username:** `admin`
- **Password:** `admin123`

Example tracking IDs (seeded in local storage service):

- `TRK1708123456001`
- `TRK1708123456002`

## Available npm Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle
- `npm run preview` — Preview production build
- `npm run lint` — Run TypeScript checks
- `npm run clean` — Remove `dist` directory

## Docker & Environment (Optional)

The repository includes production and development Docker Compose configurations and a `Makefile` with helper commands.

Common commands:

```bash
make dev
make dev-stop
make prod
make prod-stop
```

Environment template: `.env.example`

## Project Structure

```text
src/
  components/      # Shared UI components
  pages/           # Application pages (tracking, dashboard, admin modules)
  services/        # Local storage + notification services
  types.ts         # Shared TypeScript models
  App.tsx          # App routing and layout
```

## Notes

- Current implementation is demo-oriented and stores business data in browser local storage.
- For production-grade deployment, connect to a real backend and persistent database.

## License

This project is available for educational and portfolio use. Add a formal LICENSE file if you plan open-source distribution.
