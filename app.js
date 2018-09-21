const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');
const fs = require('fs');

fs.appendFile('./logs/main_server_log.txt', `\n${new Date()}: server started`, (err) => {
  if (err) debug(chalk.red(err));
});

function writeLog(message) {
  fs.appendFile('./logs/main_server_log.txt', `\n${new Date()}: ${message}`, (err) => {
    if (err) debug(chalk.red(err));
  });
}

writeLog('server started');

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

const currencyRoutes = require('./src/routes/get_currency')();

app.use('/currency', currencyRoutes);

app.get('/', (req, res) => res.send('Crypto API'));
app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));

const getStats = require('./src/api_calls/call_apis');

// getStats();

setInterval(() => {
  getStats();
  writeLog('GetStats ran');
}, 86400000);
