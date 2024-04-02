import { IMeteringPointCharges } from '../../../../data';

export interface IMeteringPointsChargesResponse {
    result: IMeteringPointChargesResponse[];
}

interface IMeteringPointChargesResponse {
    success: boolean;
    errorCode: number;
    errorText: string;
    id: string;
    stackTrace: string;
    result: IMeteringPointCharges;
}
