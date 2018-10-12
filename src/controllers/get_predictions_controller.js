const { spawn } = require("child_process");
const debug = require("debug")("app:get_predictions_cont");

function callModel(currency) {
  return new Promise((success, nosuccess) => {
    const output = '';
    const predictionModel = spawn("python3.6", [
      "models/predict_currency.py",
      currency
    ]);

    predictionModel.stdout.on("data", data => {
      output.concat(data);
    });

    predictionModel.stderr.on("data", data => {
      nosuccess(data);
    });

    predictionModel.on("close", code => {
      debug(code);
      success(output);
    });
  });
}

async function getPrediction(req, res) {
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
    const pricePromise = callModel(currency);

    pricePromise.then(data => res.send(data)).catch(err => res.send(err));
  } else {
    debug("Invalid currency detected");
    res.send("Invalid currency");
  }
}

module.exports = getPrediction;
