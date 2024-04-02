import { EndpointHandler } from '../EndpointHandler';
import { IMeteringPointsChargesResponse } from './data/IMeteringPointsChargesResponse';
import { IMeteringPointsDetailsResponse } from './data/IMeteringPointsDetailsResponse';
import { IMeteringPointsResponse } from './data/IMeteringPointsResponse';

export class MeteringPointsEndpointHandler extends EndpointHandler {
    private static endpointAddress = 'https://api.eloverblik.dk/customerapi/api/meteringpoints';
    private static meteringPointsPath = 'meteringpoints';
    private static getDetailsPath = 'meteringpoint/getDetails';
    private static getChargesPath = 'meteringpoint/getCharges';

    public static async getPoints(dataToken: string, includeAll?: boolean): Promise<IMeteringPointsResponse> {
        const headers = this.prepareHeaders(dataToken);
        return (await this.GET(
            `${this.endpointAddress}/${this.meteringPointsPath}?includeAll=${!!includeAll}`,
            headers,
        )) as IMeteringPointsResponse;
    }

    public static async getDetails(
        dataToken: string,
        meteringPointId: string | string[],
    ): Promise<IMeteringPointsDetailsResponse> {
        const response = await this.makePostRequestForData<IMeteringPointsDetailsResponse>(
            `${this.endpointAddress}/${this.getDetailsPath}`,
            dataToken,
            meteringPointId,
        );

        for (const result of response.result) {
            this.checkPossibleSystemErrors(result.errorCode);
        }

        return response;
    }

    public static async getCharges(
        dataToken: string,
        meteringPointId: string | string[],
    ): Promise<IMeteringPointsChargesResponse> {
        const response = await this.makePostRequestForData<IMeteringPointsChargesResponse>(
            `${this.endpointAddress}/${this.getChargesPath}`,
            dataToken,
            meteringPointId,
        );

        for (const result of response.result) {
            this.checkPossibleSystemErrors(result.errorCode);
        }

        return response;
    }
}
