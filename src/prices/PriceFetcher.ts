import { PriceData } from './data';
import { DatetimeHelper } from './helpers';
import { EnergiDataService, NRGI, Aura, ValidSupplyArea, ValidSupplier, Supplier } from './suppliers';

class PriceFetcher {
    private energiDataService: EnergiDataService = new EnergiDataService();
    private nrgi: NRGI = new NRGI();
    private aura: Aura = new Aura();

    private getSupplierFromString(name: ValidSupplier): Supplier {
        switch (name.toLocaleLowerCase()) {
            case 'energidataservice':
                return this.energiDataService;
            case 'nrgi':
                return this.nrgi;
            case 'aura':
                return this.aura;

            default:
                return this.energiDataService;
        }
    }

    /**
     *
     * @param supplierName The supplier from where to get the price data
     * @param dates A single or multiple dates to query for
     * @param area Grid area of Denmark. DK1 for West Denmark, DK2 for East Denmark
     * @returns
     */
    public async getPrices(
        supplierName: ValidSupplier,
        dates: Date[] | string[] | Date | string,
        area: ValidSupplyArea,
    ): Promise<PriceData[]> {
        const supplier = this.getSupplierFromString(supplierName);
        const searchDates: Date[] = DatetimeHelper.parseDates(dates);

        return await supplier.fetchPrices(searchDates, area);
    }
}

export default PriceFetcher;
