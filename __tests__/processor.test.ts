import { describe, it, expect } from 'vitest';
import { processReadings } from '../lib/processor';
import { Reading } from '../lib/types';

describe('processReadings', () => {
    it('should calculate normal delta consumption for consecutive hours', () => {
        const readings: Reading[] = [
            { meterId: 'MTR-001', timestamp: '2025-02-05T10:03:00Z', cumulativeVolume: 1000 },
            { meterId: 'MTR-001', timestamp: '2025-02-05T11:07:00Z', cumulativeVolume: 1050 }
        ];

        const result = processReadings(readings);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            meterId: 'MTR-001',
            hour: '2025-02-05T10:00:00.000Z',
            consumption: 50,
            flag: 'normal'
        });
    });

    it('should handle gap estimation and distribute consumption evenly', () => {
        const readings: Reading[] = [
            { "meterId": "MTR-002", "timestamp": "2025-02-05T10:07:00Z", "cumulativeVolume": 52230 },
            { "meterId": "MTR-002", "timestamp": "2025-02-05T14:02:00Z", "cumulativeVolume": 52530 },
        ];

        const result = processReadings(readings);

        expect(result).toHaveLength(4);
        expect(result[0]).toEqual({
            meterId: 'MTR-002',
            hour: '2025-02-05T10:00:00.000Z',
            consumption: 75,
            flag: 'gap_estimated'
        });
        expect(result[1]).toEqual({
            meterId: 'MTR-002',
            hour: '2025-02-05T11:00:00.000Z',
            consumption: 75,
            flag: 'gap_estimated'
        });
        expect(result[2]).toEqual({
            meterId: 'MTR-002',
            hour: '2025-02-05T12:00:00.000Z',
            consumption: 75,
            flag: 'gap_estimated'
        });
        expect(result[3]).toEqual({
            meterId: 'MTR-002',
            hour: '2025-02-05T13:00:00.000Z',
            consumption: 75,
            flag: 'gap_estimated'
        });
    });

    it('should detect counter reset and use current volume as consumption', () => {
        const readings: Reading[] = [
            { "meterId": "MTR-003", "timestamp": "2025-02-05T12:03:00Z", "cumulativeVolume": 890410 },
            { "meterId": "MTR-003", "timestamp": "2025-02-05T13:01:00Z", "cumulativeVolume": 45 }
        ];

        const result = processReadings(readings);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            meterId: 'MTR-003',
            hour: '2025-02-05T12:00:00.000Z',
            consumption: 45,
            flag: 'counter_reset'
        });
    });
});