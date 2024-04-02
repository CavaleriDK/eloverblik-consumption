import { ValidSupplier } from '../../../prices/suppliers';
import { PricesError } from './PricesError';

export class ResponseParseError extends PricesError {
    public response: unknown;

    constructor(supplier: ValidSupplier, response: unknown) {
        super('ResponseParseError', `Failed to parse response for supplier: ${supplier}`);

        this.response = response;
    }
}
