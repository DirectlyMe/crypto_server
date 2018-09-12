const rp = require('request-promise');
const debug = require('debug')('app:pull_currencies');
const { MongoClient } = require('mongodb');

const key = require('../config/api_keys');
const mongoConfig = require('../config/mongo_config');

class GetCryptoStats {
  constructor() {
    this.getBtcStats.bind();
  }

  getBtcStats() {
    this.requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: 'BTC',
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': key.api_key,
      },
      json: true,
      gzip: true,
    };

    rp(this.requestOptions)
      .then((response) => {
        (async function storeBTCinDB() {
          const url = mongoConfig.db.host;
          const dbname = mongoConfig.db.name;

          try {
            const client = await MongoClient.connect(url);
            const db = client.db(dbname);
            debug(`Connected to database: ${db}`);

            await db.collection('bitcoin').insertOne(response.data);
            debug('Data inserted');
          } catch (err) {
            debug(err);
          }
        }());
      })
      .catch((err) => {
        debug(err);
      });
  }
}

module.exports = new GetCryptoStats();
