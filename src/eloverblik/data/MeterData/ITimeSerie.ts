import { ITimeSeriePeriod } from './ITimeSeriePeriod';

export interface ITimeSerie {
    mRID: string;
    businessType: string;
    curveType: string;
    'measurement_Unit.name': string;
    MarketEvaluationPoint: {
        mRID: {
            codingScheme: string;
            name: string;
        };
    };
    Period: ITimeSeriePeriod[];
}
