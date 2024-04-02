import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP500Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP500Error', input);
    }
}
