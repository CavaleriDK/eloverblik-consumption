import { ValidSupplyArea } from '..';
import { getFetchHttpError } from '../../../errors/fetch';
import { PriceData } from '../../data';

export default abstract class Supplier {
    protected fetchPriceForDate<T>(url: string): Promise<T> {
        return fetch(url).then(async (response) => {
            if (!response.ok) {
                throw await getFetchHttpError(response);
            }

            return response.json();
        });
    }
    public abstract fetchPrices(dates: Date[], area: ValidSupplyArea): Promise<PriceData[]>;
}
