const { spawn } = require("child_process");
const debug = require("debug")("app:get_predictions_cont");

class PredictionController {
  async getPrediction(req, res) {
    const currency = req.params.id;
    let isValid = false;

    switch (currency) {
      case "BTC":
        isValid = true;
        break;
      case "LTC":
        isValid = true;
        break;
      case "ETH":
        isValid = true;
        break;
      case "XRP":
        isValid = true;
        break;
      default:
        isValid = false;
    }

    if (isValid) {
      const tomorrowsPrice = await this.callModel(currency);
      res.send(tomorrowsPrice);
    } else {
      debug("Invalid currency detected");
      res.send("Invalid currency");
    }
  }

  callModel(currency) {
    const predictionModel = spawn("python", [
      "models/predict_currency.py",
      currency
    ]);

    predictionModel.stdout.on("data", data => {
      const tomorrowsPrice = data;
      console.log(tomorrowsPrice);

      return tomorrowsPrice;
    });
  }
}

module.exports = PredictionController;
