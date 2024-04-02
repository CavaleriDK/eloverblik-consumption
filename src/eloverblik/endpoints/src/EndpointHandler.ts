import { ElOverblikError } from '../../../errors/eloverblik';
import { getFetchHttpError } from '../../../errors/fetch';
import { IHeaders } from './IHeaders';

export abstract class EndpointHandler {
    protected static prepareHeaders(token: string): IHeaders {
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
    }

    protected static async makePostRequestForData<T>(
        url: string,
        dataToken: string,
        meteringPointId: string | string[],
    ): Promise<T> {
        const headers = this.prepareHeaders(dataToken);
        const body = {
            meteringPoints: {
                meteringPoint: typeof meteringPointId === 'string' ? [meteringPointId] : [...meteringPointId],
            },
        };
        const response: T = (await this.POST(url, headers, JSON.stringify(body))) as T;

        return response;
    }

    protected static GET(url: string, headers: IHeaders): Promise<unknown> {
        return fetch(url, { headers }).then(async (response) => {
            if (!response.ok) {
                throw await getFetchHttpError(response);
            }

            return response.json();
        });
    }

    protected static POST(url: string, headers: IHeaders, body: string): Promise<unknown> {
        return fetch(url, {
            method: 'POST',
            headers,
            body,
        }).then(async (response) => {
            if (!response.ok) {
                throw await getFetchHttpError(response);
            }

            return response.json();
        });
    }

    protected static checkPossibleSystemErrors(errorCode: number) {
        switch (errorCode) {
            case 10001:
                throw new ElOverblikError('WrongNumberOfArguments', 'Check API documentation for more details', 10001);
            case 10007:
                throw new ElOverblikError(
                    'NoCprConsent',
                    'User has not given CPR consent. See API documentation for more details.',
                    10007,
                );
            case 20000:
                throw new ElOverblikError(
                    'WrongMeteringPointIdOrWebAccessCode',
                    'Check API documentation for more details',
                    20000,
                );
            case 20001:
                throw new ElOverblikError('MeteringPointBlocked', 'Check API documentation for more details', 20001);
            case 20002:
                throw new ElOverblikError(
                    'MeteringPointRelationAlreadyExist',
                    'Check API documentation for more details',
                    20002,
                );
            case 20003:
                throw new ElOverblikError(
                    'MeteringPointIdNot18CharsLong',
                    'Check API documentation for more details',
                    20003,
                );
            case 20005:
                throw new ElOverblikError(
                    'MeteringPointAliasTooLong',
                    'Check API documentation for more details',
                    20005,
                );
            case 20006:
                throw new ElOverblikError(
                    'WebAccessCodeNot8CharsLong',
                    'Check API documentation for more details',
                    20006,
                );
            case 20007:
                throw new ElOverblikError(
                    'WebAccessCodeContainsIllegalChars',
                    'Check API documentation for more details',
                    20007,
                );
            case 20008:
                throw new ElOverblikError('MeteringPointNotFound', 'Check API documentation for more details', 20008);
            case 20009:
                throw new ElOverblikError('MeteringPointIsChild', 'Check API documentation for more details', 20009);
            case 20010:
                throw new ElOverblikError('RelationNotFound', 'Check API documentation for more details', 20010);
            case 20011:
                throw new ElOverblikError('UnknownError', 'Check API documentation for more details', 20011);
            case 20012:
                throw new ElOverblikError('Unauthorized', 'Check API documentation for more details', 20012);
            case 20013:
                throw new ElOverblikError(
                    'NoValidMeteringPointsInList',
                    'Check API documentation for more details',
                    20013,
                );
            case 30000:
                throw new ElOverblikError(
                    'FromDateIsGreaterThanToday',
                    'Check API documentation for more details',
                    30000,
                );
            case 30001:
                throw new ElOverblikError(
                    'FromDateIsGreaterThanToDate',
                    'Check API documentation for more details',
                    30001,
                );
            case 30002:
                throw new ElOverblikError(
                    'ToDateCanNotBeEqualToFromDate',
                    'Check API documentation for more details',
                    30002,
                );
            case 30003:
                throw new ElOverblikError(
                    'ToDateIsGreaterThanToday',
                    'Check API documentation for more details',
                    30003,
                );
            case 30004:
                throw new ElOverblikError('InvalidDateFormat', 'Check API documentation for more details', 30004);
            case 30008:
                throw new ElOverblikError(
                    'RequestedAggregationUnavaliable',
                    'Check API documentation for more details',
                    30008,
                );
            case 30011:
                throw new ElOverblikError('InternalServerError', 'Check API documentation for more details', 30011);
            case 50000:
                throw new ElOverblikError('WrongTokenType', 'Check API documentation for more details', 50000);
            case 50001:
                throw new ElOverblikError('TokenNotValid', 'Check API documentation for more details', 50001);
            case 50002:
                throw new ElOverblikError('ErrorCreatingToken', 'Check API documentation for more details', 50002);
            case 50003:
                throw new ElOverblikError('TokenRegistrationFailed', 'Check API documentation for more details', 50003);
            case 50004:
                throw new ElOverblikError('TokenAlreadyActive', 'Check API documentation for more details', 50004);
            case 50005:
                throw new ElOverblikError('TokenAlreadyDeactivaed', 'Check API documentation for more details', 50005);
        }
    }
}
