import { ITimeSerie } from './ITimeSerie';

export interface IMyEnergyDataMarketDocument {
    mRID: string;
    createdDateTime: string;
    'sender_MarketParticipant.name': string;
    'sender_MarketParticipant.mRID': {
        codingScheme: string;
        name: string;
    };
    'period.timeInterval': {
        start: string;
        end: string;
    };
    TimeSeries: ITimeSerie[];
}
