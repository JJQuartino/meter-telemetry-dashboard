import { MeterTotal, HourlyRecord } from "./types";

export function sumMeterVolume(hourlyRecords: HourlyRecord[]): MeterTotal[] {
  
    const meterVolumes = new Map<string, MeterTotal>();

    hourlyRecords.forEach(record => {
        if (!meterVolumes.has(record.meterId)) {
            meterVolumes.set(record.meterId, {
                meterId: record.meterId,
                totalConsumption: 0,
                latestTimestamp: record.hour,
                status: 'active' 
            });
        }
        
        const total = meterVolumes.get(record.meterId);
        total!.totalConsumption += record.consumption;
        
        if (record.hour > total!.latestTimestamp) {
            total!.latestTimestamp = record.hour;
        }
    });    

    const latestOverallTimestamp = Math.max( //get the latest timestamp for each meter
        ...Array.from(meterVolumes.values(), m => new Date(m.latestTimestamp).getTime())
    );

    meterVolumes.forEach(total => {
        const meterLastTime = new Date(total.latestTimestamp).getTime();
        const hoursDiff = (latestOverallTimestamp - meterLastTime) / (1000 * 60 * 60);
        total.status = hoursDiff <= 2 ? 'active' : 'stale'; //set status based on whether within 2 hours of latest
    });

    return [...meterVolumes.values()];
}
