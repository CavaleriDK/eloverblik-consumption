import { ValidSupplyArea } from '../../suppliers';
import { HourlyPrice } from './HourlyPrice';

export interface PriceData {
    date: string;
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    area: ValidSupplyArea;
    prices: HourlyPrice[];
}
