const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');
const fs = require('fs');
const Cron = require('cron').CronJob;

fs.appendFile('./logs/main_server_log.txt', `\n${new Date()}: server started`, (err) => {
  if (err) debug(err);
});

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.send('Crypto API'));
app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));

const getStats = require('./src/api_calls/call_apis');

const getStatsJob = new Cron('1 1 1 * * *', () => {
  getStats();
  const date = new Date();
  debug(`[${date}]: getStatsJob started`);
}, null, true, 'America/Denver');

getStatsJob.start();
