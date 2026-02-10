# Meter Telemetry Dashboard

A Next.js application that processes water meter telemetry data and displays hourly consumption records with gap detection and counter reset handling.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Run the development server:
```bash
   npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests
```bash
npm test
```

## Project Structure
```
meter-dashboard/
├── app/
│   ├── page.tsx              # Fleet overview page
│   └── meter/[id]/
│       └── page.tsx          # Meter detail page with chart
├── lib/
│   ├── processor.ts          # Core data processing logic
│   ├── aggregator.ts         # Meter data aggregation
│   └── types.ts              # TypeScript interfaces
├── data/
│   └── readings.json         # Sample meter readings
└── __tests__/
    ├── processor.test.ts     # Processing logic tests
    └── aggregator.test.ts    # Aggregation tests
```

## Design Decisions

I chose to write the logic to combine meter data in it's own file (`lib/aggregator.ts`) rather than in (`lib/processor.ts`). This adds an extra file for a small project, but it's the codebase easier to scale and maintain if the project were to grow.

Additionally, when a reading has both a counter reset AND a time gap, I prioritized the `counter_reset` flag over `gap_estimated`, since the a reset in the counter seemed more critical. This edge case wasn't explicitly addressed in the requirements, but prioritizing hardware-level events (counter resets) over communication issues (gaps) seemed like the more practical approach.

I also used `Map<string, T>` for grouping data by meterId instead of plain objects. While plain objects have a better performance for small datasets, Map provides guaranteed insertion order and cleaner iteration syntax. Given the small size of the dataset, the small performance difference didn't have much weight in the tradeoff.