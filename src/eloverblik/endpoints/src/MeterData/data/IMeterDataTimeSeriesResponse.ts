import { IMyEnergyDataMarketDocument } from '../../../../data';

export interface IMeterDataTimeSeriesResponse {
    result: IMeterDataTimeSerieResponse[];
}

interface IMeterDataTimeSerieResponse {
    success: boolean;
    errorCode: number;
    errorText: string;
    id: string;
    stackTrace: string;
    MyEnergyData_MarketDocument: IMyEnergyDataMarketDocument;
}
