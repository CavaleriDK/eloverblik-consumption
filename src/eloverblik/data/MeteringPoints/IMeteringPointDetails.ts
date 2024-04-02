import { IChildMeteringPointData } from './IChildMeteringPointData';

export interface IMeteringPointDetails {
    meteringPointId: string;
    typeOfMP: string;
    balanceSupplierName: string;
    postcode: string;
    cityName: string;
    hasRelation: boolean;
    consumerCVR: string;
    dataAccessCVR: string;
    childMeteringPoints: IChildMeteringPointData[];
    streetCode: string;
    streetName: string;
    buildingNumber: string;
    floorId: string;
    roomId: string;
    citySubDivisionName: string;
    municipalityCode: string;
    locationDescription: string;
    settlementMethod: string;
    meterReadingOccurrence: string;
    firstConsumerPartyName: string;
    secondConsumerPartyName: string;
    meterNumber: string;
    consumerStartDate: string;

    parentMeteringPointId?: string;
    energyTimeSeriesMeasureUnit?: string;
    estimatedAnnualVolume?: string;
    gridOperatorName?: string;
    meteringGridAreaIdentification?: string;
    netSettlementGroup?: string;
    physicalStatusOfMP?: string;
    consumerCategory?: string;
    powerLimitKW?: string;
    powerLimitA?: string;
    subTypeOfMP?: string;
    productionObligation?: string;
    mpCapacity?: string;
    mpConnectionType?: string;
    disconnectionType?: string;
    product?: string;
    mpReadingCharacteristics?: string;
    meterCounterDigits?: string;
    meterCounterMultiplyFactor?: string;
    meterCounterUnit?: string;
    meterCounterType?: string;
    taxReduction?: string;
    taxSettlementDate?: string;
    mpRelationType?: string;
    balanceSupplierStartDate?: string;
    contactAddresses?: { [key: string]: string }[];
}
