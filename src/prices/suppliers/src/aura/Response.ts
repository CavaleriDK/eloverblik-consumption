export interface AuraResponse {
    lowestPriceEastWithTaxAndTransportation: number;
    highestPriceEastWithTaxAndTransportation: number;
    avgPriceEastWithTaxAndTransportation: number;

    lowestPriceWestWithTaxAndTransportation: number;
    highestPriceWestWithTaxAndTransportation: number;
    avgPriceWestWithTaxAndTransportation: number;

    chartSeries: AuraChartSeries[];

    [key: string]: number | string | AuraChartSeries[];
}

export interface AuraChartSeries {
    key: string;
    timePoints: AuraTimePoints[];
}

export interface AuraTimePoints {
    name: string;
    priceEastDenmark: number;
    priceWestDenmark: number;
}
