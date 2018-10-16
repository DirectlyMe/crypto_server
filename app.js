const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const debug = require("debug")("app");
const chalk = require("chalk");
const morgan = require("morgan");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const dailyPull = require("./src/api_calls/call_daily_pull");
const currencyRoutes = require("./src/routes/get_currency")();
const predictionRoutes = require("./src/routes/get_predictions")();
const authRoutes = require("./src/routes/auth_routes")();
const removeFirstLine = require("./src/utilities/parse_file");
const writeLog = require("./src/utilities/write_log");

class ExpressServer {
  constructor() {
    this.GDAXcurrencies = ["BTC", "ETH", "LTC"];
    this.dailyPull();
  }

  start() {
    writeLog("server started", debug);

    const app = express();
    const port = process.env.PORT || 8080;

    app.use(morgan("tiny"));
    app.use(
      session({ secret: "yoyoIsCute ", resave: false, saveUninitialized: true })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    require("./src/config/passport")(app); // eslint-disable-line

    app.use("/currency", currencyRoutes);
    app.use("/predict", predictionRoutes);
    app.use("/auth", authRoutes);

    app.get("/", (req, res) => res.send("Crypto API, current routes are /predictions and /currency"));
    app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));
  }

  dailyPull() {
    this.getCryptoStats();

    setInterval(() => {
      dailyPull();
      writeLog("GetStats ran", debug);
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
}

const Server = new ExpressServer();

Server.start();
