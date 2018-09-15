const rp = require('request-promise');
const debug = require('debug')('app:pull_currencies');
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
        currencySymbol,
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
        (async function storeBTCinDB() {
          const url = mongoConfig.db.host;
          const dbname = mongoConfig.db.name;

          try {
            const client = await MongoClient.connect(url);
            const db = client.db(dbname);
            debug(`Connected to database: ${dbname}`);

            await db.collection(`${currencySymbol}Daily`).insertOne(response.data);

            const date = new Date();
            debug(`[${date}] : ${currencySymbol} daily data inserted`);
            this.writeLogs(`[${date}] : ${currencySymbol} daily data inserted`);
          } catch (err) {
            debug(err);
          }
        }());
      })
      .catch((err) => {
        debug(err);
      });
  }

  writeLogs(message) {
    const date = new Date();
    fs.appendFile('../../logs/main_server_log.txt', `[${date}]: ${message}`);
  }
}

module.exports = GetCryptoStats;
