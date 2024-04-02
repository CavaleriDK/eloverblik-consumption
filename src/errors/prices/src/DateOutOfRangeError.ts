import { PricesError } from './PricesError';

export class DateOutOfRangeError extends PricesError {
    public searchDate: Date;

    constructor(searchDate: Date) {
        super('DateOutOfRangeError', 'No price data found for date');

        this.searchDate = searchDate;
    }

    public toString = (): string => {
        return `${this.name}: ${this.message}, ${this.searchDate.toISOString()}`;
    };
}
