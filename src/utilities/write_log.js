const fs = require("fs");
const chalk = require("chalk");

function writeLog(message, debug) {
  fs.appendFile(
    "./logs/main_server_log.txt",
    `\n${new Date()}: ${message}`,
    err => {
      if (err) debug(chalk.red(err));
    }
  );
}

module.exports = writeLog;
