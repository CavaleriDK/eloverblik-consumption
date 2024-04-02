import { FetchHTTPError } from './FetchHTTPError';
import { IFetchHTTPError } from './data/IFetchHTTPError';

export class FetchHTTP503Error extends FetchHTTPError {
    constructor(input: IFetchHTTPError) {
        super('FetchHTTP503Error', input);
    }
}
