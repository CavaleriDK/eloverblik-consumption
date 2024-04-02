import { ValidTimeAggregation } from '../..';
import { EndpointHandler } from '../EndpointHandler';
import { IMeterDataReadingsResponse } from './data/IMeterDataReadingsResponse';
import { IMeterDataTimeSeriesResponse } from './data/IMeterDataTimeSeriesResponse';

export class MeterDataEndpointHandler extends EndpointHandler {
    private static endpointAddress = 'https://api.eloverblik.dk/customerapi/api/meterdata';
    private static getTimeSeriesPath = 'gettimeseries';
    private static getMeterReadingsPath = 'getmeterreadings';

    public static async getTimeSeries(
        dataToken: string,
        dateFrom: string,
        dateTo: string,
        aggregation: ValidTimeAggregation,
        meteringPointId: string | string[],
    ): Promise<IMeterDataTimeSeriesResponse> {
        const response = await this.makePostRequestForData<IMeterDataTimeSeriesResponse>(
            `${this.endpointAddress}/${this.getTimeSeriesPath}/${dateFrom}/${dateTo}/${aggregation}`,
            dataToken,
            meteringPointId,
        );

        for (const result of response.result) {
            this.checkPossibleSystemErrors(result.errorCode);
        }

        return response;
    }

    public static async getMeterReadings(
        dataToken: string,
        dateFrom: string,
        dateTo: string,
        meteringPointId: string | string[],
    ): Promise<IMeterDataReadingsResponse> {
        const response = await this.makePostRequestForData<IMeterDataReadingsResponse>(
            `${this.endpointAddress}/${this.getMeterReadingsPath}/${dateFrom}/${dateTo}`,
            dataToken,
            meteringPointId,
        );

        for (const result of response.result) {
            this.checkPossibleSystemErrors(result.errorCode);
        }

        return response;
    }
}
