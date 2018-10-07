const { spawn } = require("child_process");

class ModelCaller {
  constructor() {
    this.prediction = 0;
  }

  callModel(currency) {
    const predictionModel = spawn("python", ["../../models/predict_btc.py", currency]);

    predictionModel.stdout.on('data', data => {
      const prediction = data;
      return prediction;
    });
  }

  async getPrediction(req, res) {
    const currency = req.params.id;

    const tomorrowPrice = await this.callModel(currency);

    res.json(tomorrowPrice);
  }
}

const model = new ModelCaller();
model.callModel();

module.exports = ModelCaller;
