import { IMeterDataReading } from './IMeterDataReading';

export interface IMeterDataReadings {
    meteringPointId: string;
    readings: IMeterDataReading[];
}
