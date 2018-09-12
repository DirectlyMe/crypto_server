const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.send('Crypto API'));
app.listen(port, () => debug(`Listening on port ${chalk.green(port)}`));

const getCurrencies = require('./src/api_calls/pull_currencies');

// getCurrencies.getBtcStats();
// getCurrencies.getLtcStats();
