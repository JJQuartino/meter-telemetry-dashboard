import { HourlyRecord, Reading } from "./types";

function getHourOfMeter(timestamp: string): string {
    const date = new Date(timestamp);
    date.setMinutes(0, 0, 0);
    return date.toISOString();
}

function getHourDifference(previousTimestamp: string, currentTimestamp: string): number {
    const previous = new Date(getHourOfMeter(previousTimestamp));
    const current = new Date(getHourOfMeter(currentTimestamp));

    return (current.getTime() - previous.getTime()) / (1000 * 60 * 60);
}

function createRecord(meterId: string, timestamp: string, consumption: number, flag: "normal" | "gap_estimated" | "counter_reset"): HourlyRecord {
  return {
    meterId,
    hour: getHourOfMeter(timestamp),
    consumption,
    flag
  };
}

export function processReadings(readings: Reading[]): HourlyRecord[] {
    const groupedByMeter = new Map<string, Reading[]>();

    readings.forEach(r => {
        if (!groupedByMeter.has(r.meterId)) //not in the map?
            groupedByMeter.set(r.meterId, []); //add it

        groupedByMeter.get(r.meterId)!.push(r); //add the whole reading
    });

    const records: HourlyRecord[] = [];

    groupedByMeter.forEach((meterReadings, meterId) => {
        for (let i = 0; i < meterReadings.length - 1; i++) { //better for accesing the previous and current reading, hence the executing condition
            const previous = meterReadings[i];
            const current = meterReadings[i + 1];

            let consumption = 0;
            let flag: "normal" | "gap_estimated" | "counter_reset" = "normal"; //so that only "normal", "gap_estimated" and "counter_reset" are valid options

            if (current.cumulativeVolume < previous.cumulativeVolume)
            {
                consumption = current.cumulativeVolume;
                flag = "counter_reset";
            }
            else
                consumption = current.cumulativeVolume - previous.cumulativeVolume;

            
            let hoursDifference = getHourDifference(previous.timestamp, current.timestamp);
            if (hoursDifference > 1) //if there's a gap in the hours
            {
                flag = flag === "normal" ? "gap_estimated" : flag; //set the flag
                const consumptionPerHour = consumption / hoursDifference; //evenly divide the consumption
                let currentReading = new Date(getHourOfMeter(previous.timestamp)); //as per the assigment, we set the time to the previous reading

                for (let h = 0; h < hoursDifference; h++)
                {
                    records.push(createRecord(meterId, currentReading.toISOString(), consumptionPerHour, flag));
                    currentReading.setHours(currentReading.getHours() + 1);
                }
            }else
                records.push(createRecord(meterId, previous.timestamp, consumption, flag));
        }
    });

    return records;
}