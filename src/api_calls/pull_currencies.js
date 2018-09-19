const rp = require('request-promise');
const debug = require('debug')('app:pull_currencies');
const chalk = require('chalk');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const key = require('../config/api_keys');
const mongoConfig = require('../config/mongo_config');

class GetCryptoStats {
  constructor() {
    this.getCurrencyStats.bind();
    this.writeLogs.bind();

    this.writeLogs('Getting crypto stats');
  }

  getCurrencyStats(currencySymbol) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: currencySymbol,
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
        const date = new Date();
        (async function storeBTCinDB() {
          const url = mongoConfig.db.host;
          const dbname = mongoConfig.db.name;

          try {
            const client = await MongoClient.connect(url);
            const db = client.db(dbname);
            debug(`Connected to database: ${dbname}`);

            await db.collection(`${currencySymbol}Daily`).insertOne(response.data);

            debug(`[${date}] : ${currencySymbol} daily data inserted`);
          } catch (err) {
            debug(err);
          }
        }());
        this.writeLogs(`[${date}] : ${currencySymbol} daily data inserted`);
      })
      .catch((err) => {
        debug(err);
      });
  }

  writeLogs(message) {
    const date = new Date();
    fs.appendFile('./logs/main_server_log.txt', `\n[${date}]: ${message}`, (err) => {
      if (err) debug(chalk.red(err));
    });
  }
}

module.exports = GetCryptoStats;
