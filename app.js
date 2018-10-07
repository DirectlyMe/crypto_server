const express = require("express");
const debug = require("debug")("app");
const chalk = require("chalk");
const morgan = require("morgan");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const dailyPull = require("./src/api_calls/call_daily_pull");
const currencyRoutes = require("./src/routes/get_currency")();
const predictionRoutes = require("./src/routes/get_predictions")();
const removeFirstLine = require("./src/utilities/parse_file");

class ExpressServer {
  constructor() {
    this.GDAXcurrencies = ["BTC", "ETH", "LTC"];
    this.dailyPull();
  }

  start() {
    this.writeLog("server started");

    const app = express();
    const port = process.env.PORT || 8080;

    app.use(morgan("tiny"));

    app.use("/currency", currencyRoutes);
    app.use("/predict", predictionRoutes);

    app.get("/", (req, res) => res.send("Crypto API, current routes are /predictions and /currency"));
    app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));
  }

  dailyPull() {
    this.getCryptoStats();

    setInterval(() => {
      dailyPull();
      this.writeLog("GetStats ran");
    }, 86400000);
  }

  getCryptoStats() {
    for (const currency of this.GDAXcurrencies) {
      this.getHistoryCSV(currency);
    }
  }

  async getHistoryCSV(currencySym) {
    const pathOg = `models/currency_data/${currencySym}_history_original.csv`;
    const pathParsed = `models/currency_data/${currencySym}_history_parsed.csv`;

    try {
      // pull all history files that we're working with
      await exec(
        `curl --insecure https://www.cryptodatadownload.com/cdd/Gdax_${currencySym}USD_d.csv > ${pathOg}`
      );

      // the first line of the csv is junk and messes up the processing
      await removeFirstLine(`${pathOg}`, `${pathParsed}`);

      debug(`grabbed ${currencySym} csv`);
    } catch (err) {
      debug(err);
    }
  }

  writeLog(message) {
    fs.appendFile(
      "./logs/main_server_log.txt",
      `\n${new Date()}: ${message}`,
      err => {
        if (err) debug(chalk.red(err));
      }
    );
  }
}

const Server = new ExpressServer();

Server.start();
