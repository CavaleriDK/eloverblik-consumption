import { MeterDataEndpointHandler } from './src/MeterData/MeterDataEndpointHandler';
import { MeteringPointsEndpointHandler } from './src/MeteringPoints/MeteringPointsEndpointHandler';
import { TokenEndpointHandler } from './src/Token/TokenEndpointHandler';

type ValidTimeAggregation = 'Actual' | 'Quarter' | 'Hour' | 'Day' | 'Month' | 'Year';

export { TokenEndpointHandler, MeteringPointsEndpointHandler, MeterDataEndpointHandler, ValidTimeAggregation };
