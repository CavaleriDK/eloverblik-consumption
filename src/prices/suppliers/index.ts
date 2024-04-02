import EnergiDataService from './src/energidataservice/EnergiDataService';
import Aura from './src/aura/Aura';
import NRGI from './src/nrgi/NRGI';
import Supplier from './src/Supplier';

type ValidSupplier = 'EnergiDataService' | 'NRGI' | 'Aura';
type ValidSupplyArea = 'DK1' | 'DK2';

export { EnergiDataService, Aura, NRGI, Supplier, ValidSupplier, ValidSupplyArea };
