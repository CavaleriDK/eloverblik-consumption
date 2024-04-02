import { expect, describe, test } from '@jest/globals';
import { PriceFetcher } from '../index';
import { DateOutOfRangeError } from '../errors/prices';
/*
import { ElOverblik } from '../index';
import { TokenRefreshError } from '../errors/eloverblik';

describe('ElOverblik API', () => {
    test('Can authenticate', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await expect(elOverblik.refreshDataAccessToken()).resolves.not.toThrow();
    });

    test('Authentication fails without valid refresh token', async () => {
        const elOverblik = new ElOverblik('');
        await expect(elOverblik.refreshDataAccessToken()).rejects.toThrow(TokenRefreshError);
    });

    test('Can get metering points pre-authenticated', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await elOverblik.refreshDataAccessToken();

        const meteringPoints = await elOverblik.getMeteringPoints();
        expect(meteringPoints).toHaveLength(1);
    });

    test('Can get metering points without pre-authentication', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );

        const meteringPoints = await elOverblik.getMeteringPoints();
        expect(meteringPoints).toHaveLength(1);
    });

    test('Can get metering points details pre-authenticated', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await elOverblik.refreshDataAccessToken();

        const meteringPointsDetails = await elOverblik.getMeteringPointsDetails(process.env.METERING_POINT_ID || '');
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get metering points details without pre-authentication', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );

        const meteringPointsDetails = await elOverblik.getMeteringPointsDetails(process.env.METERING_POINT_ID || '');
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get metering points charges pre-authenticated', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await elOverblik.refreshDataAccessToken();

        const meteringPointsDetails = await elOverblik.getMeteringPointsCharges(process.env.METERING_POINT_ID || '');
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get metering points charges without pre-authentication', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );

        const meteringPointsDetails = await elOverblik.getMeteringPointsCharges(process.env.METERING_POINT_ID || '');
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get meter data time series pre-authenticated', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await elOverblik.refreshDataAccessToken();

        const meteringPointsDetails = await elOverblik.getMeterDataTimeSeries(
            '2024-03-16',
            '2024-03-18',
            'Hour',
            process.env.METERING_POINT_ID || '',
        );
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get meter data time series without pre-authentication', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );

        const meteringPointsDetails = await elOverblik.getMeterDataTimeSeries(
            '2024-03-16',
            '2024-03-18',
            'Hour',
            process.env.METERING_POINT_ID || '',
        );
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get meter data readings pre-authenticated', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );
        await elOverblik.refreshDataAccessToken();

        const meteringPointsDetails = await elOverblik.getMeterDataReadings(
            '2024-03-16',
            '2024-03-18',
            process.env.METERING_POINT_ID || '',
        );
        expect(meteringPointsDetails).toHaveLength(1);
    });

    test('Can get meter data readings without pre-authentication', async () => {
        const elOverblik = new ElOverblik(
            process.env.ELOVERBLIK_REFRESH_TOKEN || ''
        );

        const meteringPointsDetails = await elOverblik.getMeterDataReadings(
            '2024-03-16',
            '2024-03-18',
            process.env.METERING_POINT_ID || '',
        );
        expect(meteringPointsDetails).toHaveLength(1);
    });
});
*/
describe('Price fetchers', () => {
    const priceFetcher = new PriceFetcher();

    test('EnergiDataService fetcher can get price for one date', async () => {
        const fetchedPrices = await priceFetcher.getPrices('EnergiDataService', ['2024-03-04'], 'DK1');

        expect(fetchedPrices.length).toBe(1);
        expect(fetchedPrices[0].prices.length).toBe(24);
    });

    test('EnergiDataService fetcher can get price for multiple dates', async () => {
        const fetchedPrices = await priceFetcher.getPrices('EnergiDataService', ['2024-03-04', '2024-03-05'], 'DK1');

        expect(fetchedPrices.length).toBe(2);
    });

    test('EnergiDataService fetcher fails to get prices on too early dates', async () => {
        await expect(priceFetcher.getPrices('EnergiDataService', ['1990-03-04'], 'DK1')).rejects.toThrow(
            DateOutOfRangeError,
        );
    });

    test('Aura fetcher can get price for one date', async () => {
        const fetchedPrices = await priceFetcher.getPrices('Aura', ['2024-03-04'], 'DK1');

        expect(fetchedPrices.length).toBe(1);
        expect(fetchedPrices[0].prices.length).toBe(24);
    });

    test('Aura fetcher can get price for multiple dates', async () => {
        const fetchedPrices = await priceFetcher.getPrices('Aura', ['2024-03-04', '2024-03-05'], 'DK1');

        expect(fetchedPrices.length).toBe(2);
    });

    test('Aura fetcher fails to get prices on too early dates', async () => {
        await expect(priceFetcher.getPrices('Aura', ['1990-03-04'], 'DK1')).rejects.toThrow(DateOutOfRangeError);
    });

    test('NRGI fetcher can get price for one date', async () => {
        const fetchedPrices = await priceFetcher.getPrices('NRGI', ['2024-03-04'], 'DK1');

        expect(fetchedPrices.length).toBe(1);
        expect(fetchedPrices[0].prices.length).toBe(24);
    });

    test('NRGI fetcher can get price for multiple dates', async () => {
        const fetchedPrices = await priceFetcher.getPrices('NRGI', ['2024-03-04', '2024-03-05'], 'DK1');

        expect(fetchedPrices.length).toBe(2);
    });

    test('NRGI fetcher fails to get prices on too early dates', async () => {
        await expect(priceFetcher.getPrices('NRGI', ['1990-03-04'], 'DK1')).rejects.toThrow(DateOutOfRangeError);
    });
});
