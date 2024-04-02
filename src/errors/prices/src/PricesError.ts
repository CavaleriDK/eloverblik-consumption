export abstract class PricesError extends Error {
    constructor(name: string, errorMessage: string) {
        super();
        this.name = name;
        this.message = errorMessage;
    }

    public toString = (): string => {
        return `${this.name}: ${this.message}`;
    };
}
