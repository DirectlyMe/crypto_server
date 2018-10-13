const rp = require("request-promise");
const debug = require("debug")("app:get_currency_controller");
const writeLogs = require("../utilities/write_log");

const { coinCapKey } = require("../config/api_keys");

function getCurrency(req, res) {
  const currency = req.params.id;
  let isValid = false;

  switch (currency) {
    case "BTC":
      isValid = true;
      break;
    case "LTC":
      isValid = true;
      break;
    case "ETH":
      isValid = true;
      break;
    case "XRP":
      isValid = true;
      break;
    default:
      isValid = false;
  }

  if (isValid) {
    const requestOptions = {
      method: "GET",
      uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      qs: {
        symbol: currency,
        convert: "USD"
      },
      headers: {
        "X-CMC_PRO_API_KEY": coinCapKey
      },
      json: true,
      gzip: true
    };

    rp(requestOptions)
      .then(response => {
        res.json(response.data);
        debug(`Pulled ${currency}`);
        writeLogs(`Pulled ${currency}`, debug);
      })
      .catch(err => {
        writeLogs(err, debug);
        debug(err);
      });
  } else {
    res.send(`${currency} not found`);
  }
}

module.exports = { getCurrency };
