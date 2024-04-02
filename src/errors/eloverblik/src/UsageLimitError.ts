import { ElOverblikError } from './ElOverblikError';

export class UsageLimitError extends ElOverblikError {
    constructor(message: string) {
        super('UsageLimitError', message);
    }
}
