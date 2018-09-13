const rp = require('request-promise');
const debug = require('debug')('app:pull_currencies');
const { MongoClient } = require('mongodb');

const key = require('../config/api_keys');
const mongoConfig = require('../config/mongo_config');

class GetCryptoStats {
  constructor() {
    this.getBtcStats.bind();
    this.getEthStats.bind();
    this.getLtcStats.bind();
    this.getXrpStats.bind();
  }

  getBtcStats() {
    console.log('in btc stats');
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

            await db.collection('bitcoinDaily').insertOne(response.data);
            const date = new Date();
            debug(`[${date}] : Bitcoin daily data inserted`);
          } catch (err) {
            debug(err);
          }
        }());
      })
      .catch((err) => {
        debug(err);
      });
  }

  getLtcStats() {
    console.log('in ltc stast');
    this.requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: 'LTC',
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

            await db.collection('litecoinDaily').insertOne(response.data);
            const date = new Date();
            debug(`[${date}] : Litecoin daily data inserted`);
          } catch (err) {
            debug(err);
          }
        }());
      })
      .catch((err) => {
        debug(err);
      });
  }

  getXrpStats() {
    this.requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: 'XRP',
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

            await db.collection('xrpDaily').insertOne(response.data);
            const date = new Date();
            debug(`[${date}] : XRP daily data inserted`);
          } catch (err) {
            debug(err);
          }
        }());
      })
      .catch((err) => {
        debug(err);
      });
  }

  getEthStats() {
    this.requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        symbol: 'ETH',
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

            await db.collection('etheriumDaily').insertOne(response.data);
            const date = new Date();
            debug(`[${date}] : Etherium daily data inserted`);
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
