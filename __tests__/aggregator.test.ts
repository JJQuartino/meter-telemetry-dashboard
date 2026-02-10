import { describe, it, expect } from 'vitest';
import { sumMeterVolume } from '../lib/aggregator';
import { HourlyRecord } from '../lib/types';

describe('sumMeterVolume', () => {
    it('should sum consumption per meter and set status', () => {
        const hourlyRecords: HourlyRecord[] = [
            {meterId: 'MTR-001', hour: '2025-02-05T10:00:00.000Z', consumption: 50, flag: 'normal'},
            {meterId: 'MTR-001', hour: '2025-02-05T11:00:00.000Z', consumption: 100, flag: 'normal'},
            {meterId: 'MTR-002', hour: '2025-02-05T10:00:00.000Z', consumption: 75, flag: 'gap_estimated'},
            {meterId: 'MTR-002', hour: '2025-02-05T11:00:00.000Z', consumption: 75, flag: 'gap_estimated'},
            {meterId: 'MTR-002', hour: '2025-02-05T12:00:00.000Z', consumption: 75, flag: 'gap_estimated'},
            {meterId: 'MTR-002', hour: '2025-02-05T13:00:00.000Z', consumption: 75, flag: 'gap_estimated'},
            {meterId: 'MTR-003', hour: '2025-02-05T12:00:00.000Z',consumption: 45, flag: 'counter_reset'},
            {meterId: 'MTR-003', hour: '2025-02-05T13:00:00.000Z',consumption: 45, flag: 'counter_reset'}
        ];

        const result = sumMeterVolume(hourlyRecords);
        
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
            meterId: 'MTR-001',
            latestTimestamp: '2025-02-05T11:00:00.000Z',
            totalConsumption: 150,
            status: 'active'
        });
        expect(result[1]).toEqual({
            meterId: 'MTR-002',
            latestTimestamp: '2025-02-05T13:00:00.000Z',
            totalConsumption: 300,
            status: 'active'
        });
        expect(result[2]).toEqual({
            meterId: 'MTR-003',
            latestTimestamp: '2025-02-05T13:00:00.000Z',
            totalConsumption: 90,
            status: 'active'
        });        
    });
});
