const express = require("express");
const { getCurrency } = require("../controllers/get_currencies_controller");
const signedIn = require("../utilities/signed_in");

const pullCurrencies = express.Router();

function router() {
  pullCurrencies.use(signedIn);

  pullCurrencies.route("/get-currency/:id").get(getCurrency);

  return pullCurrencies;
}

module.exports = router;
