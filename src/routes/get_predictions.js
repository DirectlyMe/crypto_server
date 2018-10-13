const express = require("express");
const getPrediction = require("../controllers/get_predictions_controller");
const signedIn = require("../middleware/signed_in");

const pullPredictions = express.Router();

function router() {
  pullPredictions.use(signedIn);

  pullPredictions.route("/get-prediction/:id").get(getPrediction);

  return pullPredictions;
}

module.exports = router;
