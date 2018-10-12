const express = require("express");
const getCurrency = require("../controllers/get_currencies_controller");

const pullCurrencies = express.Router();

function router() {
  pullCurrencies.route("/get-currency/:id").get(getCurrency);

  return pullCurrencies;
}

module.exports = router;
