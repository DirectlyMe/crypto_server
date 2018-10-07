const express = require("express");
const GetPredictionsCont = require("../controllers/get_predictions_controller");

const pullPredictions = express.Router();
const PredictionsCont = new GetPredictionsCont();


function router() {
  pullPredictions.route("/get-prediction/:id").get(PredictionsCont.getPrediction);

  return pullPredictions;
}

module.exports = router;
