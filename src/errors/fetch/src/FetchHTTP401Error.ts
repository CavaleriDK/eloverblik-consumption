import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP401Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP401Error', input);
    }
}
