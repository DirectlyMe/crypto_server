const express = require("express");
const getPrediction = require("../controllers/get_predictions_controller");

const pullPredictions = express.Router();

function router() {
  pullPredictions.route("/get-prediction/:id").get(getPrediction);

  return pullPredictions;
}

module.exports = router;
