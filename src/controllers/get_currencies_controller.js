const rp = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');
const debug = require('debug')('app:get_currency_controller');

const key = require('../config/api_keys');

class GetCurrencyController {
  constructor() {
    this.writeLogs.bind();
    this.getCurrency.bind();
  }

  writeLogs(message) {
    const date = new Date();
    fs.appendFile('./logs/main_server_log.txt', `\n[${date}]: ${message}`, (err) => {
      if (err) debug(chalk.red(err));
    });
  }

  getCurrency(req, res) {
    const currency = req.params.id;
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: currency,
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': key.api_key,
      },
      json: true,
      gzip: true,
    };

    rp(requestOptions)
      .then((response) => {
        res.json(response.data);
        debug(`Pulled ${currency}`);
        // writeLogs(`Pulled ${currency}`);
      })
      .catch((err) => {
        // this.writeLogs(err);
        debug(err);
      });
  }
}

module.exports = GetCurrencyController;
