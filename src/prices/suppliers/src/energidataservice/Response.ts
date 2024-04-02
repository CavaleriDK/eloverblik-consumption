export interface EnergiDataServiceResponse {
    records: EnergiDataServicePrice[];
    [key: string]: string | number | EnergiDataServicePrice[];
}

export interface EnergiDataServicePrice {
    HourUTC: string;
    HourDK: string;
    SpotPriceDKK: number;
    [key: string]: string | number;
}
