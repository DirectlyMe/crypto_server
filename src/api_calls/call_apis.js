const PullCurrencies = require('./pull_currencies');

function getAllStats() {
  const GetCurrencies = new PullCurrencies();

  GetCurrencies.getCurrencyStats('BTC');
  GetCurrencies.getCurrencyStats('LTC');
  GetCurrencies.getCurrencyStats('ETH');
  GetCurrencies.getCurrencyStats('XRP');
}

module.exports = getAllStats;
