import { ValidSupplyArea } from '../..';
import { FetchHTTP500Error } from '../../../../errors/fetch';
import { DateOutOfRangeError } from '../../../../errors/prices';
import { HourlyPrice, PriceData } from '../../../data';
import { DatetimeHelper, MathUtils } from '../../../helpers';
import Supplier from '../Supplier';
import { NRGIResponse } from './Response';

export default class NRGI extends Supplier {
    private readonly baseUrl = 'https://nrgi.dk/api/common/pricehistory';

    private convertToPriceData(responseData: NRGIResponse[], area: ValidSupplyArea): PriceData[] {
        const priceData: PriceData[] = responseData.map((response) => {
            const { date, averagePrice, lowestPrice, highestPrice } = response;

            const prices: HourlyPrice[] = response.prices.map((price) => {
                const {
                    localTime,
                    kwPrice: spotPrice,
                    totalGrid: totalFees,
                    totalPriceInclVat,
                    isLowestPrice: lowest,
                    isHighestPrice: highest,
                } = price;
                const utcTime = DatetimeHelper.getISOStringUTCFromDKTime(localTime);
                const totalPriceExclVat = MathUtils.roundToDecimals(totalPriceInclVat * 0.8, 2); // Remove 25% added value tax

                return {
                    localTime,
                    utcTime,
                    spotPrice,
                    totalFees,
                    totalPriceInclVat,
                    totalPriceExclVat,
                    lowest,
                    highest,
                };
            });

            return {
                date,
                averagePrice,
                lowestPrice,
                highestPrice,
                area,
                prices,
            };
        });

        return priceData;
    }

    public async fetchPrices(dates: Date[], area: ValidSupplyArea): Promise<PriceData[]> {
        const promises = dates.map((date) => {
            const dateString = DatetimeHelper.getDateString(date, true, true);
            const url = `${this.baseUrl}?region=${area}&date=${dateString}&includeGrid=true`;

            return this.fetchPriceForDate<NRGIResponse>(url).catch((error) => {
                if (error instanceof FetchHTTP500Error) {
                    throw new DateOutOfRangeError(date);
                } else {
                    throw error;
                }
            });
        });

        const responses = await Promise.all(promises);
        const priceData = this.convertToPriceData(responses, area);

        return priceData;
    }
}
