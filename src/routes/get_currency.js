const express = require("express");
const GetCurrenciesController = require("../controllers/get_currencies_controller");

const pullCurrencies = express.Router();
const CurrencyController = new GetCurrenciesController();

function router() {
  pullCurrencies.route("/get-currency/:id").get(CurrencyController.getCurrency);

  return pullCurrencies;
}

module.exports = router;
