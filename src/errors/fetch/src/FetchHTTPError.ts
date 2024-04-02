import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTPError extends Error implements IFetchHTTPError {
    public errorCode: number;
    public data?: {
        url: string;
        [key: string]: boolean | number | string;
    };
    constructor(name: string, input: IFetchHTTPError) {
        super();
        this.name = name;
        this.errorCode = input.errorCode;
        this.message = input.message;
        this.data = input.data;
    }

    public toString = (): string => {
        return `${this.errorCode} ${this.message}`;
    };
}
