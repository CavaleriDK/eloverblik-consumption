import { ValidSupplyArea } from '../..';
import { DateOutOfRangeError } from '../../../../errors/prices';
import { HourlyPrice, PriceData } from '../../../data';
import { DatetimeHelper, MathUtils } from '../../../helpers';
import Supplier from '../Supplier';
import { EnergiDataServiceResponse } from './Response';

export default class EnergiDataService extends Supplier {
    private readonly baseUrl = 'https://api.energidataservice.dk/dataset/Elspotprices';

    private convertToPriceData(
        responseData: EnergiDataServiceResponse[],
        area: ValidSupplyArea,
        dates: Date[],
    ): PriceData[] {
        const priceData: PriceData[] = responseData.map((response, i) => {
            if (response.records.length > 0) {
                const date = DatetimeHelper.getDateString(dates[i], true);
                let highestPrice = 0;
                let lowestPrice = Number.MAX_VALUE;
                let totalPrice = 0;

                const prices: HourlyPrice[] = response.records.map((records) => {
                    const { HourDK: localTime } = records;
                    const utcTime = DatetimeHelper.getISOStringUTCFromDKTime(localTime);
                    const lowest = false;
                    const highest = false;

                    // Convert MWH price to KWH price rounded as DKK CENTS.
                    const spotPrice = MathUtils.roundToDecimals(records.SpotPriceDKK / 1000, 2);
                    totalPrice += spotPrice;
                    lowestPrice = spotPrice < lowestPrice ? spotPrice : lowestPrice;
                    highestPrice = spotPrice > highestPrice ? spotPrice : highestPrice;

                    return {
                        localTime,
                        utcTime,
                        spotPrice,
                        lowest,
                        highest,
                    };
                });

                prices.forEach((price) => {
                    price.lowest = price.spotPrice === lowestPrice;
                    price.highest = price.spotPrice === highestPrice;
                });

                const averagePrice = MathUtils.roundToDecimals(totalPrice / response.records.length, 2);
                return {
                    date,
                    averagePrice,
                    lowestPrice,
                    highestPrice,
                    area,
                    prices,
                };
            } else {
                throw new DateOutOfRangeError(dates[i]);
            }
        });

        return priceData;
    }

    public async fetchPrices(dates: Date[], area: ValidSupplyArea): Promise<PriceData[]> {
        const promises = dates.map((date) => {
            const startString = DatetimeHelper.getDateString(date, true);
            const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            const endString = DatetimeHelper.getDateString(endDate, true);

            const url = `${this.baseUrl}?start=${startString}&end=${endString}&filter={"PriceArea":["${area}"]}&sort=HourDK asc&timezone=dk`;

            return this.fetchPriceForDate<EnergiDataServiceResponse>(url);
        });

        const responses = await Promise.all(promises);
        const priceData = this.convertToPriceData(responses, area, dates);

        return priceData;
    }
}
