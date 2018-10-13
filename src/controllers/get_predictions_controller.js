const { MongoClient } = require("mongodb");
const debug = require("debug")("app:get_predictions_cont");

const mongoConfig = require("../config/mongo_config")

async function retrievePrediction(currency) {
  const url = mongoConfig.db.host;
  const dbname = mongoConfig.db.name;

  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbname);

    const coll = await db.collection("predictedPrices")
    const prediction = coll.findOne({ "Date": new Date() })

    return prediction[currency]; 
  } catch(err) {
    debug("Could not get currencies");
  }

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
    res.send(prediction)
  } else {
    debug("Invalid currency detected");
    res.send("Invalid currency");
  }
}

module.exports = getPrediction;
