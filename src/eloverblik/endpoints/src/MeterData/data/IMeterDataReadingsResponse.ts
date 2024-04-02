import { IMeterDataReadings } from '../../../../data';

export interface IMeterDataReadingsResponse {
    result: IMeterDataReadingResponse[];
}

interface IMeterDataReadingResponse {
    success: boolean;
    errorCode: number;
    errorText: string;
    id: string;
    stackTrace: string;
    result: IMeterDataReadings;
}
