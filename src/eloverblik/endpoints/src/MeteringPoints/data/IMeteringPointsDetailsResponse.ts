import { IMeteringPointDetails } from '../../../../data';

export interface IMeteringPointsDetailsResponse {
    result: IMeteringPointDetailsResponse[];
}

interface IMeteringPointDetailsResponse {
    success: boolean;
    errorCode: number;
    errorText: string;
    id: string;
    stackTrace: string;
    result: IMeteringPointDetails;
}
