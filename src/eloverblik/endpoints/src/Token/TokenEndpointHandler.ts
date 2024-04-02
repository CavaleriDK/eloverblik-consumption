import { EndpointHandler } from '../EndpointHandler';
import { ITokenResponse } from './data/ITokenResponse';

export class TokenEndpointHandler extends EndpointHandler {
    private static endpointAddress = 'https://api.eloverblik.dk/customerapi/api/token';

    public static async getDataToken(refreshToken: string): Promise<string> {
        const headers = this.prepareHeaders(refreshToken);
        const response: ITokenResponse = (await this.GET(this.endpointAddress, headers)) as ITokenResponse;

        return response.result;
    }
}
