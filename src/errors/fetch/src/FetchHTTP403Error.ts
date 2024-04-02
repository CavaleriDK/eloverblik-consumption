import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP403Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP403Error', input);
    }
}
