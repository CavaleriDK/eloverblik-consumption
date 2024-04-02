export interface IMeteringPointCharges {
    meteringPointId: string;
    subscriptions: ISubscriptions[];
    tariffs: ITariffs[];
    fees: IFees[];
}

interface ISubscriptions {
    name: string;
    description: string;
    owner: string;
    validFromDate: string;
    validToDate: string;
    periodType: string;
    price: number;
    quantity: number;
}

interface ITariffs {
    name: string;
    description: string;
    owner: string;
    validFromDate: string;
    validToDate: string;
    periodType: string;
    prices: ITariffsPrices[];
}

interface ITariffsPrices {
    position: string;
    price: number;
}

interface IFees {
    name: string;
    description: string;
    owner: string;
    validFromDate: string;
    validToDate: string;
    periodType: string;
    price: number;
    quantity: number;
}
