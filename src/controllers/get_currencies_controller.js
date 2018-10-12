const rp = require("request-promise");
const fs = require("fs");
const chalk = require("chalk");
const debug = require("debug")("app:get_currency_controller");

const { apiKey } = require("../config/api_keys");

function writeLogs(message) {
  const date = new Date();
  fs.appendFile(
    "./logs/main_server_log.txt",
    `\n[${date}]: ${message}`,
    err => {
      if (err) debug(chalk.red(err));
    }
  );
}

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
        "X-CMC_PRO_API_KEY": apiKey
      },
      json: true,
      gzip: true
    };

    rp(requestOptions)
      .then(response => {
        res.json(response.data);
        debug(`Pulled ${currency}`);
        writeLogs(`Pulled ${currency}`);
      })
      .catch(err => {
        writeLogs(err);
        debug(err);
      });
  } else {
    res.send(`${currency} not found`);
  }
}

module.exports = getCurrency;
