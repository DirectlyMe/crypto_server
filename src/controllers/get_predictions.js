const { spawn } = require("child_process");

class ModelCaller {
  constructor() {
    this.prediction = 0;
  }

  callModel() {
    const predictionModel = spawn("python", ["../../models/predict_btc.py"]);

    predictionModel.stdout.on('data', data => {
      this.prediction = data;
    });
  }
}

const model = new ModelCaller();
model.callModel();

module.exports = ModelCaller;
