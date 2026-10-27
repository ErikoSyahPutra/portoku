# Design Specification: Standalone Self-Hosted Server & App Monitoring (S.host Style)

- **Date**: 2026-10-27
- **Project Name**: `pulse-server` (Monitoring Server)
- **Target Folder**: `D:\MAHESA\Proyek Web\monitoring-server` (Standalone Open-Source Repository)
- **Design Inspiration**: `original-ea68b24e6015b2be72c2a7b26de12114.webp` (s.host style dashboard)

---

## 1. Product Requirements & Scope (PRD)

### 1.1 Goal & Vision
A modern, lightweight, self-hosted server and application monitoring tool distributed as an open-source project. Users can deploy it on their VPS with either a **single-command Docker Compose** or **PM2 native process**, providing a public-ready status dashboard with an industrial dark/electric-lime visual aesthetic.

### 1.2 Target Audience
Developers, indie hackers, and sysadmins managing VPS instances running Docker containers, PM2 Node.js apps, or standard web services who want clean, real-time observability without heavy enterprise stacks (e.g., Prometheus/Grafana).

### 1.3 Key Requirements
1. **Host Telemetry**:
   - Real-time CPU, RAM, Disk, and Network Bandwidth (Rx/Tx).
   - System metadata: OS, Kernel, Uptime, Host IP, and CPU Cores.
2. **Dual Process Auto-Detection**:
   - **Docker Containers**: Auto-detect running containers via `/var/run/docker.sock` (container ID, name, status, CPU %, RAM MB).
   - **PM2 Node.js Apps**: Auto-detect apps via PM2 IPC/API (`pm2.list()`) including working directories (`/var/www/*`), status, CPU %, and memory.
   - **System Top Processes**: Fallback list of top CPU/memory consuming OS processes when neither Docker nor PM2 is active.
3. **HTTP / Service Uptime Probes**:
   - Configurable list of endpoint URLs (e.g. `https://smpd.domain.com`).
   - Periodic health checks (every 30 seconds), calculating HTTP status codes, latency in ms, and SLA percentage.
4. **Binary Status Indicator (0/1)**:
   - Status `1` (Active/Online): High-contrast Emerald/Lime indicator with pulsing glow.
   - Status `0` (Inactive/Offline): High-contrast Rose/Red indicator with error details.
   - 30-Day mini bar chart showing daily uptime/downtime blocks.
5. **Metrics Retention (30 Days)**:
   - **Live Ring Buffer**: 5-second interval stored in-memory for live smooth charts.
   - **24 Hours**: 1-minute rollup stored in SQLite.
   - **7 Days**: 5-minute averaged rollup in SQLite.
   - **30 Days**: 1-hour averaged rollup in SQLite.
   - Automatic database vacuum / TTL cleanup keeping SQLite footprint below 50 MB.
6. **Public Exposure & Security**:
   - Public read-only status view accessible without login.
   - Admin action gate (PIN or Admin Token in `.env`) required for destructive actions (e.g., restart/stop container or PM2 process).

---

## 2. Technical Architecture & Data Flow

### 2.1 Architecture Diagram
```
+-------------------------------------------------------------------------+
|                                HOST VPS                                 |
|                                                                         |
|  +---------------------+   +---------------------+   +---------------+  |
|  |   Docker Daemon     |   |     PM2 Daemon      |   |  System OS    |  |
|  | (/var/run/docker)   |   | (~/.pm2/rpc.sock)   |   |  (/proc & OS) |  |
|  +----------+----------+   +----------+----------+   +-------+-------+  |
|             |                         |                      |          |
|             +-------------------------+----------------------+          |
|                                       |                                 |
|                                       v                                 |
|                         +---------------------------+                   |
|                         |  Node.js Daemon Collector |                   |
|                         |    (systeminformation,    |                   |
|                         |    dockerode, pm2 API)    |                   |
|                         +-------------+-------------+                   |
|                                       |                                 |
|                     +-----------------+-----------------+               |
|                     |                                   |               |
|                     v                                   v               |
|            +------------------+              +----------------------+   |
|            |    SQLite DB     |              | Server-Sent Events / |   |
|            | (Rolled-up stats)|              | WebSocket Streamer   |   |
|            +------------------+              +----------+-----------+   |
|                                                         |               |
|                                                         v               |
|                                              +----------------------+   |
|                                              |  Next.js 15 Web App  |   |
|                                              |  (Tailwind, Lucide,  |   |
|                                              |   Recharts Sparkline)|   |
|                                              +----------------------+   |
+-------------------------------------------------------------------------+
```

### 2.2 Directory Layout (Standalone Repository)
Location: `D:\MAHESA\Proyek Web\monitoring-server`
```text
monitoring-server/
├── apps/
│   ├── web/                         # Next.js frontend dashboard
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Main dashboard (s.host style)
│   │   │   ├── status/page.tsx      # Public lightweight status page
│   │   │   └── api/
│   │   │       ├── live/route.ts    # SSE stream endpoint
│   │   │       ├── metrics/route.ts # Historical metrics query API
│   │   │       └── actions/route.ts # Authenticated restart/stop actions
│   │   ├── components/
│   │   │   ├── SidebarNav.tsx       # Dark sidebar with electric lime pill
│   │   │   ├── ServerList.tsx       # Middle column active/shutdown servers
│   │   │   ├── MetricCharts.tsx     # CPU/RAM/Bandwidth sparklines
│   │   │   ├── ProcessTable.tsx     # Docker / PM2 toggleable process table
│   │   │   ├── RadialUsage.tsx      # Circular SVG traffic gauge
│   │   │   └── StatusBadge.tsx      # 0/1 binary active indicator
│   │   └── lib/
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   └── collector/                   # Background telemetry worker
│       ├── src/
│       │   ├── collectors/
│       │   │   ├── system.ts        # CPU, RAM, Disk, Net via systeminformation
│       │   │   ├── docker.ts        # Dockerode socket reader
│       │   │   ├── pm2.ts           # PM2 programmatic IPC client
│       │   │   └── ping.ts          # HTTP health checker
│       │   ├── db/
│       │   │   ├── schema.sql       # SQLite tables (metrics_raw, metrics_hourly)
│       │   │   └── rollup.ts        # 30-day retention & rollup jobs
│       │   └── index.ts             # Collector loop & IPC server
│
├── config/
│   └── monitors.example.json        # Endpoints to monitor
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml           # 1-command deployment
├── ecosystem.config.js              # PM2 deployment configuration
├── package.json
└── README.md
```

---

## 3. Impeccable Design System

### 3.1 Design Rules (Anti AI-Slop)
- **No Washed-Out Text**: Background `#0B0C0E`, card background `#13151A`. Primary text `#FAFAFA`, secondary text `#A1A1AA`. High contrast meeting WCAG AA standards.
- **Zero Emojis**: Iconography strictly powered by `lucide-react` (`<Activity />`, `<Cpu />`, `<Server />`, `<HardDrive />`, `<Wifi />`, `<Terminal />`, `<Power />`, `<RefreshCw />`).
- **Tactile Micro-Interactions**:
  - Buttons have subtle 3D physical borders (`border-b-2`, `active:translate-y-[1px]`, `cursor-pointer`).
  - Active server item in the middle panel uses a deep emerald container `#0B2520` with `#184E43` border.
  - Active navigation pill uses vibrant `#CCFF00` (Electric Lime) with dark text.

### 3.2 Color Tokens
| Token | Hex Value | Usage |
|---|---|---|
| Background Dark | `#0B0C0E` | Main page background |
| Surface Dark | `#13151A` | Cards, panels, modal dialogs |
| Surface Border | `#222630` | Structural dividers & borders |
| Electric Lime | `#CCFF00` | Active nav pill, primary CTA buttons |
| Deep Forest Highlight | `#0B2520` | Active selected server card |
| Status 1 (Online) | `#34D399` / `#064E3B` | Active text & pill background |
| Status 0 (Offline) | `#FB7185` / `#4C0519` | Inactive text & pill background |

---

## 4. Error Handling & Edge Cases
1. **Docker Socket Missing**: If `/var/run/docker.sock` is absent (non-Docker VPS), the collector gracefully silences Docker polling and switches default view to PM2/System processes.
2. **PM2 Not Installed / Running**: If PM2 daemon is offline, PM2 collector logs a warning and disables the PM2 tab without crashing the app.
3. **Target Website Downtime**: If an HTTP health check fails (timeout, 5xx, or network error), status switches to `0` instantly, latency displays `Err`, and the event is recorded in the downtime log.
4. **Database Growth Protection**: SQLite runs a scheduled cron every midnight to purge raw data older than 24 hours (after rolling up into 5-minute and 1-hour summaries), keeping disk space bounded.

---

## 5. Verification & Testing Strategy
1. **Collector Unit Tests**: Validate mock responses for `docker.ts`, `pm2.ts`, and `system.ts`.
2. **Rollup Verification**: Test SQLite rollup logic using simulated 30-day time-series data to ensure aggregate averages and queries run under 10ms.
3. **Deployment Dry-Run**:
   - Test Docker Compose spin-up (`docker compose up --build`).
   - Test PM2 spin-up (`pm2 start ecosystem.config.js`).
