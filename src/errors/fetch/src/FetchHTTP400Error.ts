import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP400Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP400Error', input);
    }
}
