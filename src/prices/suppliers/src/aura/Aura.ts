import { ValidSupplyArea } from '../..';
import { DateOutOfRangeError, ResponseParseError } from '../../../../errors/prices';
import { HourlyPrice, PriceData } from '../../../data';
import { DatetimeHelper, MathUtils } from '../../../helpers';
import Supplier from '../Supplier';
import { AuraResponse } from './Response';

export default class Aura extends Supplier {
    private readonly baseUrl = 'https://www.aura.dk/api/hour-price/data';
    private readonly currentBlockContentReference = 40291;

    private convertToPriceData(responseData: AuraResponse[], area: ValidSupplyArea, dates: Date[]): PriceData[] {
        const priceData: PriceData[] = responseData.map((response, i) => {
            if (Object.keys(response).length > 1) {
                const date = DatetimeHelper.getDateString(dates[i], true);
                const averagePrice = MathUtils.roundToDecimals(
                    area === 'DK1'
                        ? response.avgPriceWestWithTaxAndTransportation
                        : response.avgPriceEastWithTaxAndTransportation,
                    2,
                );
                const lowestPrice = MathUtils.roundToDecimals(
                    area === 'DK1'
                        ? response.lowestPriceWestWithTaxAndTransportation
                        : response.lowestPriceEastWithTaxAndTransportation,
                    2,
                );
                const highestPrice = MathUtils.roundToDecimals(
                    area === 'DK1'
                        ? response.highestPriceWestWithTaxAndTransportation
                        : response.highestPriceEastWithTaxAndTransportation,
                    2,
                );

                const spotPrices = response.chartSeries.find((chart) => chart.key === 'AURA FlexEl (til AURA)');
                const transportPrices = response.chartSeries.find(
                    (chart) => chart.key === 'Transport af el (til dit netselskab)',
                );
                const stateFeePrices = response.chartSeries.find((chart) => chart.key === 'Afgifter (til staten)');

                if (spotPrices && transportPrices && stateFeePrices) {
                    const prices: HourlyPrice[] = spotPrices.timePoints.map((spotPriceTimePoint) => {
                        const transportPriceTimePoint = transportPrices.timePoints.find(
                            (timepoint) => timepoint.name === spotPriceTimePoint.name,
                        );
                        const stateFeeTimePoint = stateFeePrices.timePoints.find(
                            (timepoint) => timepoint.name === spotPriceTimePoint.name,
                        );

                        if (transportPriceTimePoint && stateFeeTimePoint) {
                            const localTimeDate = new Date(dates[i]);
                            localTimeDate.setHours(parseInt(spotPriceTimePoint.name));
                            const localTime = DatetimeHelper.getISOStringForDKTime(localTimeDate);
                            const utcTime = DatetimeHelper.getISOStringUTCFromDKTime(localTimeDate);
                            const spotPrice = MathUtils.roundToDecimals(
                                area === 'DK1'
                                    ? spotPriceTimePoint.priceWestDenmark
                                    : spotPriceTimePoint.priceEastDenmark,
                                2,
                            );
                            const totalFees = MathUtils.roundToDecimals(
                                area === 'DK1'
                                    ? transportPriceTimePoint.priceWestDenmark + stateFeeTimePoint.priceWestDenmark
                                    : transportPriceTimePoint.priceEastDenmark + stateFeeTimePoint.priceEastDenmark,
                                2,
                            );
                            const totalPriceInclVat = MathUtils.roundToDecimals(totalFees + spotPrice, 2);
                            const totalPriceExclVat = MathUtils.roundToDecimals(totalPriceInclVat * 0.8, 2); // Remove 25% added value tax
                            const lowest = lowestPrice === totalPriceInclVat;
                            const highest = highestPrice === totalPriceInclVat;

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
                        } else {
                            throw new ResponseParseError('Aura', response);
                        }
                    });

                    return {
                        date,
                        averagePrice,
                        lowestPrice,
                        highestPrice,
                        area,
                        prices,
                    };
                } else {
                    throw new ResponseParseError('Aura', response);
                }
            } else {
                throw new DateOutOfRangeError(dates[i]);
            }
        });

        return priceData;
    }

    public async fetchPrices(dates: Date[], area: ValidSupplyArea): Promise<PriceData[]> {
        const promises = dates.map((date) => {
            const dateString = DatetimeHelper.getDateString(date, true, true, '/');
            const url = `${this.baseUrl}?date=${dateString}&currentBlockContentReference=${this.currentBlockContentReference}`;

            return this.fetchPriceForDate<AuraResponse>(url);
        });

        const responses = await Promise.all(promises);
        const priceData = this.convertToPriceData(responses, area, dates);

        return priceData;
    }
}
