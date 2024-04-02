import { FetchHTTP400Error } from './src/FetchHTTP400Error';
import { FetchHTTP401Error } from './src/FetchHTTP401Error';
import { FetchHTTP403Error } from './src/FetchHTTP403Error';
import { FetchHTTP429Error } from './src/FetchHTTP429Error';
import { FetchHTTP500Error } from './src/FetchHTTP500Error';
import { FetchHTTP503Error } from './src/FetchHTTP503Error';
import { FetchHTTPError } from './src/FetchHTTPError';
import { IFetchHTTPError } from './src/data/IFetchHTTPError';

const getFetchHttpError = async (response: Response): Promise<FetchHTTPError> => {
    const { status: errorCode, statusText: message, url } = response;
    const defaultError: IFetchHTTPError = { errorCode, message, data: { url } };

    switch (response.status) {
        case 400:
            return new FetchHTTP400Error(defaultError);
        case 401:
            return new FetchHTTP401Error(defaultError);
        case 403:
            return new FetchHTTP403Error(defaultError);
        case 429:
            return new FetchHTTP429Error(defaultError);
        case 500:
            return new FetchHTTP500Error(defaultError);
        case 503:
            return new FetchHTTP503Error(defaultError);

        default:
            return new FetchHTTPError('FetchHTTPError', { ...defaultError });
    }
};

export {
    getFetchHttpError,
    FetchHTTP400Error,
    FetchHTTP401Error,
    FetchHTTP403Error,
    FetchHTTP429Error,
    FetchHTTP500Error,
    FetchHTTP503Error,
};
