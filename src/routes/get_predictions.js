const express = require("express");
const PredictionsCont = require("../controllers/get_predictions_controller");

const pullPredictions = express.Router();
const PredictionController = new PredictionsCont();


function router() {
  pullPredictions.route("/get-prediction/:id").get(PredictionController.getPrediction);

  return pullPredictions;
}

module.exports = router;
