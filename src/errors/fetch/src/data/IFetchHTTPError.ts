import { IFetchHTTPErrorData } from './IFetchHTTPErrorData';

export interface IFetchHTTPError {
    errorCode: number;
    message: string;
    data?: IFetchHTTPErrorData;
}
