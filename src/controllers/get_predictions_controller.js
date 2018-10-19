const { MongoClient } = require("mongodb");
const moment = require("moment");
const debug = require("debug")("app:get_predictions_cont");

const mongoConfig = require("../config/mongo_config");

async function retrievePrediction(currency) {
  const url = mongoConfig.db.host;
  const dbname = mongoConfig.db.name;

  try {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbname);

    const coll = await db.collection("predictedPrices");

    const currentDate = moment().format("YYYY-MM-DD");
    const predictions = await coll.findOne({ Date: currentDate });

    const prediction = {
      date: predictions.Date,
      name: currency,
      prediction: predictions[currency]
    };

    return prediction;
  } catch (err) {
    debug(err);
    debug("Could not get currencies");
  }

  return "couldn't find a prediction";
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
    const prediction = await retrievePrediction(currency);
    res.json(prediction);
  } else {
    debug("Invalid currency detected");
    res.send("Invalid currency");
  }
}

module.exports = getPrediction;
