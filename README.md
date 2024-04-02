<h2  align="center">ElOverblik Consumption</h2>
<p align="center"> Unofficial NodeJS SDK to compare power consumption from ElOverblik (powered by EnergiNet) with prices from various suppliers.</p>

# Getting started
 ![NPM Version](https://img.shields.io/npm/v/eloverblik-consumption) ![Node LTS](https://img.shields.io/node/v-lts/eloverblik-consumption) ![NPM License](https://img.shields.io/npm/l/eloverblik-consumption)
 
As an electricity customer in Denmark, you have access to your data in DataHub via [eloverblik.dk](https://eloverblik.dk/welcome). This package is an unofficial SDK wrapper build on top of the [ElOverblik API](https://energinet.dk/data-om-energi/datahub/eloverblik/) to easily access your data.

The SDK currently wraps the endpoints to fetch readonly data. Endpoints to make changes to your ElOverblik account or your associated metering points have not been implemented as of yet.

Feel free to report if you experience any problems: [Issues](https://github.com/CavaleriDK/eloverblik-consumption/issues).

Demo usage can be found on [https://cavaleri.dk/portfolio/eloverblik-electricity-prices](https://cavaleri.dk/portfolio/eloverblik-electricity-prices/).

## Setup and installation

Install the latest version of this package using npm `npm install eloverblik-consumption`

Then include the library in your project with either

```ts
// Using the ESM module
import {ElOverblik, PriceFetcher} from "eloverblik-consumption"
```
or
```js
// Using the CJS module
const {ElOverblik, PriceFetcher} = require("eloverblik-consumption");
```

Alternatively, load the library directly in your HTML using the CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/eloverblik-consumption/dist/browser/eloverblik-consumption.min.js"></script>

<script>
  // Exposed to global window
  window.PriceFetcher;
  window.ElOverblik;
</script>
```
## Usage

The package exposese two main classes. The `PriceFetcher` class allows you to fetch the hourly price of electricity from various supplies. The `ElOverblik` class allows you to access your own electricity consumption and cross reference consumption with prices.

Check out the [demo site](https://cavaleri.dk/portfolio/eloverblik-electricity-prices/) to see an example of using the various methods.

### PriceFetcher

`PriceFetcher` enables you to get the current hourly price of electricity for any period. This class gives you access to prices from a couple of suppliers, and can supply the current spot prices including applicable fees and VAT (not all suppliers support fees included).

Using the class is as easy as 1-2-3

```ts
const priceFetcher = new PriceFetcher();

// Get todays price from EnergiDataService
const prices: PriceData[] = await priceFetcher.getPrices("energidataservice", new Date(), "DK1");
```

`getPrices` accepts 3 parameters.

* `supplierName`: Any valid power supplier in Denmark. Currently the supported suppliers are `energidataservice`, `nrgi`, `aura`. (EnergiDataService offers an open API to get the current market, spot price for electricity per hour.)
* `dates`: The date(s) to search for. Can be a string, a date object or an array of either. The method will always return prices in arrays of full days with 24 hours.
* `area`: The power grid area to fetch prices for. Can be either `DK1` for west Denmark or `DK2` for east Denmark.

Feel free to create PR or request any other suppliers to add as valid suppliers by [creating an issue](https://github.com/CavaleriDK/eloverblik-consumption/issues/new/choose).

### ElOverblik

You need to create a Refresh Token for your ElOverblik account in order to access your own data via the API. In short, this is done by first logging into the [ElOverblik portal](https://eloverblik.dk/welcome) using your MitID credentials, and creating a token in the "Datadeling" section of your profile settings.

You can find more details and a full step by step guide on the relevant [Energinet document](https://energinet.dk/media/pa2fzoj3/adgang-til-egne-data-via-api-kald.pdf). Enter your refresh token here and authenticate in order to proceed.

Once you have a refresh token, you can instantiate the `ElOverblik` class with the token and optionally with an existing data access token from a previous use.

```ts
import {ElOverblik} from "eloverblik-consumption";

const elOverblik = new ElOverblik('REFRESH_TOKEN', 'OPTIONALLY_DATA_ACCESS_TOKEN');
```

The library can handle authentication automatically and will use the refresh token to obtain a new data access token whenever needed. However, you can manually authenticate if needed.

```ts
const elOverblik = new ElOverblik('REFRESH_TOKEN');
const dataAccessToken: string = await elOverblik.refreshDataAccessToken();

// Store dataAccessToken as needed. This token is valid for 24 hours.
```

Alternatively, you can always obtain the latest valid dataAccessToken exposed directly from the ElOverblik object. This is useful if the library has automatically updated the token after the previously used token was expired.

```ts
const elOverblik = new ElOverblik('REFRESH_TOKEN');
const meteringPoints = await elOverblik.getMeteringPoints();

const dataAccessToken = elOverblik.dataAccessToken;

// Store dataAccessToken as needed. This token is valid for 24 hours.
```

All methods can be called with the optional parameter `throwIfUnauthenticated: boolean` if you want to avoid the automatic data token refresh behaviour. Setting this parameter value to `true` will make all methods throw the `TokenRefreshError` exception and you need to manually refresh the data access token to continue.

```ts
const elOverblik = new ElOverblik('REFRESH_TOKEN', 'EXISTING_BUT_EXPIRED_DATA_ACCESS_TOKEN');

try {
  const meteringPoints = await elOverblik.getMeteringPoints(false, false); // includeAll: false, throwIfUnauthenticated: false
} catch (e) {
  if (e instanceof TokenRefreshError) {
    const dataAccessToken = await elOverblik.refreshDataAccessToken();
    // Store dataAccessToken as needed. This token is valid for 24 hours.
  } else {
    // Handle errors..
  }
}
```

All methods returns an array of data objects that map directly to the data structure from the underlying ElOverblik API. The response data is documented in great detail on the [EnergiNet documentation](https://energinet.dk/media/4beb0pgg/customer-and-third-party-api-for-datahub-eloverblik-data-description_validfrom_20240402.pdf)

## Limitations

The `getMeteringPointsCharges` method on `ElOverblik` returns the current charges and the ElOverblik API does not provide any historical data. It is for that same reason not possible to accurately determine prices going back in time unless you keep track of any changes of charges on your own. Keep in mind that fees may be different during summer or winter.

Additionally, usage limitations can be found on on the [ElOverblik Swagger Docs](https://api.eloverblik.dk/customerapi/index.html). At the time of releasing this, the following limitations apply:

* Calls to GetToken are restricted to 1 per minute per IP address.
* The total number of calls per IP address is restricted to 25 per minute.
* The total number of calls for all users is restricted to 400 per minute.
* You can request data for a maximum period of 730 days at a time

If you exceed any one of these limits, you will get an http error 429 - Too many requests.
If DataHub is not able to keep up with the demand - even if the above limits are not exceeded - you may get an http error 503 - DataHub unavailable.

Using the `getPrices` method on `PriceFetcher` from a browser context (either using the ESM module or the minified browser script) will fail on account of CORS limitations for any other suppliers than `energidataservice`.

## Contributions

Contributions are encouraged and more than welcome. 

Feel free to [create an issue](https://github.com/CavaleriDK/eloverblik-consumption/issues/new/choose) for any new feature that you would like to see or any problems that you may face.

Submit a new PR to solve an existing issue or introduce a new feature, but please document how and why this is done to ease the whole process of reviewing a new contribution.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md) 