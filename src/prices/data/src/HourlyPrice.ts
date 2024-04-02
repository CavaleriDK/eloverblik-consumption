export interface HourlyPrice {
    localTime: string;
    utcTime: string;
    spotPrice: number;
    totalFees?: number;
    totalPriceExclVat?: number;
    totalPriceInclVat?: number;
    highest: boolean;
    lowest: boolean;
}
