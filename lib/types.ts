export interface Reading {
  meterId: string;
  timestamp: string;
  cumulativeVolume: number;
}

export interface HourlyRecord {
  meterId: string;
  hour: string;
  consumption: number;
  flag: "normal" | "gap_estimated" | "counter_reset"; //if it were only flag: string, "banana" would be acceptable.
}

export interface MeterTotal {
  meterId: string;
  latestTimestamp: string;
  totalConsumption: number;
  status: 'active' | 'stale';
}