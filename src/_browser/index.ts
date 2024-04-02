import { PriceFetcher, ElOverblik } from '../index';

declare global {
    interface Window {
        ElOverblik: unknown;
        PriceFetcher: unknown;
    }
}

(window as Window).ElOverblik = ElOverblik;
(window as Window).PriceFetcher = PriceFetcher;
