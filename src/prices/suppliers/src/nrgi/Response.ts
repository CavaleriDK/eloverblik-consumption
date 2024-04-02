export interface NRGIResponse {
    prices: NRGIPrice[];
    date: string;
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
    [key: string]: number | string | NRGIPrice[];
}

export interface NRGIPrice {
    localTime: string;
    kwPrice: number;
    totalGrid: number;
    totalPriceInclVat: number;
    isHighestPrice: boolean;
    isLowestPrice: boolean;
    [key: string]: number | string | boolean;
}
