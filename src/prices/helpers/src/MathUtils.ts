export class MathUtils {
    public static roundToDecimals(number: number, decimals: number): number {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    public static floorToDecimals(number: number, decimals: number): number {
        return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    public static ceilToDecimals(number: number, decimals: number): number {
        return Math.ceil(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
}
