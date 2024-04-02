import { ElOverblikError } from './ElOverblikError';

export class TokenRefreshError extends ElOverblikError {
    constructor(message: string) {
        super('TokenRefreshError', message);
    }
}
