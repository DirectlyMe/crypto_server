const GetCurrencies = require('./pull_currencies');

async function getAllStats() {
  await GetCurrencies.getBtcStats();
  await GetCurrencies.getEthStats();
  await GetCurrencies.getLtcStats();
  await GetCurrencies.getXrpStats();
  process.exit();
}

getAllStats();
