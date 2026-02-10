import readingsData from '@/data/readings.json';
import { processReadings } from '@/lib/processor';
import Link from 'next/link';
import ConsumptionChart from '@/components/ConsumptionChart';

export default async function MeterDetail({ params }: { params: { id: string } }) {
  const { id: meterId } = await params; //since NextJS 15, the framework requires to await route parameters before using them. const meterId = params.id displayed no data
  
  const allRecords = processReadings(readingsData);
  const meterRecords = allRecords.filter(r => r.meterId === meterId);

  return (
    <main className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Fleet Overview
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">{meterId} - Hourly Consumption</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Consumption Trend</h2>
        <ConsumptionChart data={meterRecords} />
        <div className="flex gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded" /> Normal</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-600 rounded" /> Estimated</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded" /> Reset</span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Hourly Records</h2>
        <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-800 dark:text-slate-100">
              <th className="border dark:border-slate-700 p-2 text-left">Hour</th>
              <th className="border dark:border-slate-700 p-2 text-left">Consumption (gal)</th>
              <th className="border dark:border-slate-700 p-2 text-left">Flag</th>
            </tr>
          </thead>
          <tbody>
            {meterRecords.map((record, idx) => (
              <tr key={idx}>
                <td className="border p-2">{new Date(record.hour).toUTCString()}</td>
                <td className="border p-2">{record.consumption.toFixed(2)}</td>
                <td className={`border p-2 ${
                  record.flag === 'gap_estimated' ? 'text-orange-600' :
                  record.flag === 'counter_reset' ? 'text-red-600' :
                  'text-green-600'
                }`}>
                  {record.flag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}