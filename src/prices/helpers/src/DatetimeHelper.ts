export class DatetimeHelper {
    private static isDate(date: Date | string): date is Date {
        return (date as Date).toUTCString !== undefined;
    }
    private static isString(date: Date | string): date is Date {
        return typeof date === 'string';
    }

    private static parseDate(date: Date | string): Date {
        if (this.isDate(date)) {
            return date;
        } else if (this.isString(date)) {
            return new Date(date);
        }

        throw new Error('Failed to parse date');
    }

    public static parseDates(dates: Date[] | string[] | Date | string): Date[] {
        if (!Array.isArray(dates)) {
            return [this.parseDate(dates)];
        }

        const parsedDates: Date[] = [];

        for (const date of dates) {
            parsedDates.push(this.parseDate(date));
        }

        return parsedDates;
    }

    public static setToMidnight(date: Date, localTime: boolean = true): Date {
        if (localTime) {
            date.setHours(0, 0, 0, 0);
        } else {
            date.setUTCHours(0, 0, 0, 0);
        }

        return date;
    }

    public static getDateString(
        date: Date,
        localTime: boolean = true,
        omitLeadingZeroes: boolean = false,
        separator = '-',
    ): string {
        const year = localTime ? date.getFullYear() : date.getUTCFullYear();
        const month = (localTime ? date.getMonth() : date.getUTCMonth()) + 1; // getMonth is 0-indexed
        const day = localTime ? date.getDate() : date.getUTCDate();
        const padding = omitLeadingZeroes ? 1 : 2;

        return `${year}${separator}${month.toString().padStart(padding, '0')}${separator}${day.toString().padStart(padding, '0')}`;
    }

    public static getISOStringUTCFromDKTime(date: Date | string): string {
        const utcDate = DatetimeHelper.parseDate(date);
        const offset = 60 + utcDate.getTimezoneOffset();
        utcDate.setMinutes(utcDate.getMinutes() + offset);

        return utcDate.toISOString();
    }

    public static getISOStringForDKTime(date: Date): string {
        const padding = 2;
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(padding, '0')}-${date.getDate().toString().padStart(padding, '0')}T${date.getHours().toString().padStart(padding, '0')}:${date.getMinutes().toString().padStart(padding, '0')}:${date.getSeconds().toString().padStart(padding, '0')}`;
    }
}
