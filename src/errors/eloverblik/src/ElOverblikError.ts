export class ElOverblikError extends Error {
    public errorCode?: number;

    constructor(name: string, errorMessage: string, errorCode?: number) {
        super();
        this.name = name;
        this.message = errorMessage;
        this.errorCode = errorCode;
    }

    public toString = (): string => {
        if (typeof this.errorCode !== 'undefined') {
            return `${this.errorCode} ${this.name}: ${this.message}`;
        }
        return `${this.name}: ${this.message}`;
    };
}
