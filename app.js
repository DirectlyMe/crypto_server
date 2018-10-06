const express = require("express");
const path = require("path");
const debug = require("debug")("app");
const chalk = require("chalk");
const morgan = require("morgan");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const dailyPull = require("./src/api_calls/call_daily_pull");
const currencyRoutes = require("./src/routes/get_currency")();

class ExpressServer {
  start() {
    this.writeLog("server started");

    const app = express();
    const port = process.env.PORT || 8080;

    app.use(morgan("tiny"));
    app.use(express.static(path.join(__dirname, "/public")));

    app.use("/currency", currencyRoutes);

    app.get("/", (req, res) => res.send("Crypto API"));
    app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));

    this.getBTCHistory();
  }

  async getBTCHistory() {
    await exec(
      "curl https://www.cryptodatadownload.com/cdd/Gdax_BTCUSD_d.csv > models/currency_data/btc_history.csv",
    );
  }

  // currently not in use
  dailyPull() {
    setInterval(() => {
      dailyPull();
      this.writeLog("GetStats ran");
    }, 86400000);
  }

  writeLog(message) {
    fs.appendFile(
      "./logs/main_server_log.txt",
      `\n${new Date()}: ${message}`,
      (err) => {
        if (err) debug(chalk.red(err));
      },
    );
  }
}

const Server = new ExpressServer();

Server.start();
