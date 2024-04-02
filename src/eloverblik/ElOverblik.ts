import { TokenRefreshError, UsageLimitError } from '../errors/eloverblik';
import { FetchHTTP401Error, FetchHTTP403Error, FetchHTTP429Error, FetchHTTP503Error } from '../errors/fetch';
import { IMeterDataReadings, IMeteringPointCharges, IMeteringPointDetails, IMyEnergyDataMarketDocument } from './data';
import {
    TokenEndpointHandler,
    MeteringPointsEndpointHandler,
    MeterDataEndpointHandler,
    ValidTimeAggregation,
} from './endpoints';

export default class ElOverblik {
    private refreshToken: string;
    private _dataAccessToken?: string;

    /**
     * The data access token currently in use.
     */
    public get dataAccessToken() {
        return this._dataAccessToken;
    }

    /**
     * Instantiate a new ElOverblik class.
     *
     * @param refreshToken Refresh token from the ElOverblik portal
     * @param dataAccessToken Existing data token from a previous authentication
     */
    constructor(refreshToken: string, dataAccessToken?: string) {
        this.refreshToken = refreshToken;
        this._dataAccessToken = dataAccessToken;
    }

    private handleGeneralErrors(error: unknown): void {
        if (error instanceof FetchHTTP429Error) {
            throw new UsageLimitError(
                'Too many requests, see limits on https://api.eloverblik.dk/customerapi/index.html',
            );
        } else if (error instanceof FetchHTTP503Error) {
            throw new UsageLimitError('DataHub unavailable');
        }
    }

    private async attemptTokenRefresh(error: unknown, throwIfUnauthenticated: boolean): Promise<boolean> {
        if (error instanceof FetchHTTP401Error && !throwIfUnauthenticated) {
            await this.refreshDataAccessToken();
            return true;
        } else if (error instanceof FetchHTTP401Error && throwIfUnauthenticated) {
            throw new TokenRefreshError('The provided token does not meet the requirements.');
        }

        return false;
    }

    /**
     * Calls the Token endpoint and generates a new data access token.
     * The token is valid for 24 hours and can be reused later when instantiating the ElOverblik class.
     *
     * @returns A newly generated data access token
     */
    public async refreshDataAccessToken(): Promise<string> {
        try {
            this._dataAccessToken = await TokenEndpointHandler.getDataToken(this.refreshToken);
            return this._dataAccessToken;
        } catch (error) {
            if (error instanceof FetchHTTP401Error) {
                throw new TokenRefreshError('The provided token does not meet the requirements.');
            } else if (error instanceof FetchHTTP403Error) {
                throw new TokenRefreshError('A non-refresh token was used.');
            } else {
                this.handleGeneralErrors(error);
            }
            throw error;
        }
    }

    /**
     * Returns a list of metering points.
     *
     * @param includeAll When includeAll is false, only the metering points with relations are returned. When includeAll is true the list will be a merge of the related metering points with a lookup using CPR or CVR.
     * @param throwIfUnauthenticated Set to avoid refreshing the data access token automatically
     *
     * @returns Details of each metering access point available
     */
    public async getMeteringPoints(
        includeAll = false,
        throwIfUnauthenticated = false,
    ): Promise<IMeteringPointDetails[]> {
        try {
            const response = await MeteringPointsEndpointHandler.getPoints(this._dataAccessToken || '', includeAll);
            return response.result;
        } catch (error) {
            const shouldRetry = await this.attemptTokenRefresh(error, throwIfUnauthenticated);
            if (shouldRetry) {
                return await this.getMeteringPoints(includeAll, true);
            } else {
                this.handleGeneralErrors(error);
            }

            throw error;
        }
    }

    /**
     * Returns a list of metering points with details.
     *
     * @param meteringPointId ID of metering points to query for
     * @param throwIfUnauthenticated Set to avoid refreshing the data access token automatically
     *
     * @returns Expanded details of each metering point
     */
    public async getMeteringPointsDetails(
        meteringPointId: string | string[],
        throwIfUnauthenticated = false,
    ): Promise<IMeteringPointDetails[]> {
        try {
            const response = await MeteringPointsEndpointHandler.getDetails(
                this._dataAccessToken || '',
                meteringPointId,
            );
            return response.result.map((singlePointDetails) => {
                return singlePointDetails.result;
            });
        } catch (error) {
            const shouldRetry = await this.attemptTokenRefresh(error, throwIfUnauthenticated);
            if (shouldRetry) {
                return await this.getMeteringPointsDetails(meteringPointId, true);
            } else {
                this.handleGeneralErrors(error);
            }

            throw error;
        }
    }

    /**
     * Returns price data for a list of metering points.
     *
     * @param meteringPointId ID of metering points to query for
     * @param throwIfUnauthenticated Set to avoid refreshing the data access token automatically
     *
     * @returns Returns price data broken down by tariffs, fees and subscriptions
     */
    public async getMeteringPointsCharges(
        meteringPointId: string | string[],
        throwIfUnauthenticated = false,
    ): Promise<IMeteringPointCharges[]> {
        try {
            const response = await MeteringPointsEndpointHandler.getCharges(
                this._dataAccessToken || '',
                meteringPointId,
            );
            return response.result.map((singlePointDetails) => {
                return singlePointDetails.result;
            });
        } catch (error) {
            const shouldRetry = await this.attemptTokenRefresh(error, throwIfUnauthenticated);
            if (shouldRetry) {
                return await this.getMeteringPointsCharges(meteringPointId, true);
            } else {
                this.handleGeneralErrors(error);
            }

            throw error;
        }
    }

    /**
     * Returns a timeserie for each metering point in list.
     *
     * @param dateFrom YYYY-MM-DD formatted date to search from
     * @param dateTo YYYY-MM-DD formatted date to search to
     * @param aggregation Time aggregation
     * @param meteringPointId ID of metering points to query for
     * @param throwIfUnauthenticated Set to avoid refreshing the data access token automatically
     *
     * @returns One MyEnergyData_MarketDocument structure will be returned per metering point
     */
    public async getMeterDataTimeSeries(
        dateFrom: string,
        dateTo: string,
        aggregation: ValidTimeAggregation,
        meteringPointId: string | string[],
        throwIfUnauthenticated = false,
    ): Promise<IMyEnergyDataMarketDocument[]> {
        try {
            const response = await MeterDataEndpointHandler.getTimeSeries(
                this._dataAccessToken || '',
                dateFrom,
                dateTo,
                aggregation,
                meteringPointId,
            );
            return response.result.map((singleTimeSerieResponse) => {
                return singleTimeSerieResponse.MyEnergyData_MarketDocument;
            });
        } catch (error) {
            const shouldRetry = await this.attemptTokenRefresh(error, throwIfUnauthenticated);
            if (shouldRetry) {
                return await this.getMeterDataTimeSeries(dateFrom, dateTo, aggregation, meteringPointId, true);
            } else {
                this.handleGeneralErrors(error);
            }

            throw error;
        }
    }

    /**
     * This request is used for querying meter readings for one or more (linked/related) metering points for a specified period.
     *
     * @notes Submission of meter readings to DataHub is no longer mandatory since end of 2021. Therefore, data may not be available for all metering points
     *
     * @param dateFrom YYYY-MM-DD formatted date to search from
     * @param dateTo YYYY-MM-DD formatted date to search to
     * @param meteringPointId ID of metering points to query for
     * @param throwIfUnauthenticated Set to avoid refreshing the data access token automatically
     *
     * @returns Returns a meterreading for at given date for each metering point in list.
     */
    public async getMeterDataReadings(
        dateFrom: string,
        dateTo: string,
        meteringPointId: string | string[],
        throwIfUnauthenticated = false,
    ): Promise<IMeterDataReadings[]> {
        try {
            const response = await MeterDataEndpointHandler.getMeterReadings(
                this._dataAccessToken || '',
                dateFrom,
                dateTo,
                meteringPointId,
            );

            return response.result.map((singleTimeSerieResponse) => {
                return singleTimeSerieResponse.result;
            });
        } catch (error) {
            const shouldRetry = await this.attemptTokenRefresh(error, throwIfUnauthenticated);
            if (shouldRetry) {
                return await this.getMeterDataReadings(dateFrom, dateTo, meteringPointId, true);
            } else {
                this.handleGeneralErrors(error);
            }

            throw error;
        }
    }
}
