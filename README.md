# Species Extinction Risk Dashboard

A web-based dashboard for visualising biodiversity monitoring data collected from acoustic sensors deployed in the field. Built as part of a thesis project.

## Features

- **Project overview** — browse monitoring campaigns with location, date range, and status
- **Species detection list** — view all species detected per campaign or per sensor, with IUCN Red List status badges and confidence scores
- **IUCN donut chart** — interactive breakdown of species by conservation status (LC, NT, VU, EN, CR, EX, DD)
- **Detection details** — per-species detection history, audio playback, and image lightbox
- **Sensor drill-down** — filter detections by individual sensor
- **Data import** — upload new detection data into a campaign

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 + TypeScript |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Charts | ECharts + echarts-for-react |
| Icons | Lucide React |
| Build | Vite 6 |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dev server runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── api/              # API client and mock data layer
│   └── mock/         # Mock responses for development
├── app/
│   ├── components/   # Shared layout components (AppLayout, RailNav, etc.)
│   ├── contexts/     # React context (ProjectContext)
│   ├── data/         # Type definitions and mock datasets
│   └── pages/
│       ├── ProjectDetail/
│       │   └── components/   # OverviewTab, SpeciesList, IucnDonutChart, etc.
│       └── DataImport.tsx
├── styles/           # Global CSS and Tailwind config
└── main.tsx
```

## IUCN Status Reference

| Code | Meaning |
|---|---|
| LC | Least Concern |
| NT | Near Threatened |
| VU | Vulnerable |
| EN | Endangered |
| CR | Critically Endangered |
| EX | Extinct in the Wild |
| DD | Data Deficient |
