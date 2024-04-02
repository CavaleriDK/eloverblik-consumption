import { ITimeSeriePeriodPoint } from './ITimeSeriePeriodPoint';

export interface ITimeSeriePeriod {
    resolution: string;
    timeInterval: {
        start: string;
        end: string;
    };
    Point: ITimeSeriePeriodPoint[];
}
