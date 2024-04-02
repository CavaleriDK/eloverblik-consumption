import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP429Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP429Error', input);
    }
}
