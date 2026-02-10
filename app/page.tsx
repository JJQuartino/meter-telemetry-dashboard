import Link from 'next/link';
import readingsData from '@/data/readings.json';
import { processReadings } from '@/lib/processor';
import { sumMeterVolume } from '@/lib/aggregator';

export default function FleetOverview() {
  const hourlyRecords = processReadings(readingsData);
  const meterSummaries = sumMeterVolume(hourlyRecords);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Fleet Overview</h1>
      
      <div className="grid gap-4">
        {meterSummaries.map(meter => (
          <Link 
            key={meter.meterId} 
            href={`/meter/${meter.meterId}`}
            className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{meter.meterId}</h2>
            <p>Total Consumption: {meter.totalConsumption.toFixed(2)} gallons</p>
            <p>Latest Reading: {new Date(meter.latestTimestamp).toUTCString()}</p> {/* was displaying 3:00:00 pm, possibly due to my UTC-3 timezone */}
            <p>Status: <span className={meter.status === 'active' ? 'text-green-600' : 'text-red-600'}>
              {meter.status}
            </span></p>
          </Link>
        ))}
      </div>
    </main>
  );
}