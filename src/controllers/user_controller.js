const { MongoClient } = require("mongodb");
const debug = require("debug")("app:auth_controller");

const mongoConfig = require("../config/mongo_config");

async function setReminder(req, res) {
  const { currency, priceReminder } = req.body;
  const { user } = req;
  const url = mongoConfig.db.host;
  const dbname = mongoConfig.db.name;

  try {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbname);

    const coll = await db.collection("users");
    const retrievedUser = await coll.findOne({ username: user.username });

    if (retrievedUser.reminders === null) {
      debug("in null reminder if");
      retrievedUser.reminders = {};
    }

    debug(retrievedUser);

    const { reminders } = retrievedUser;
    reminders[currency] = priceReminder;

    await coll.findOneAndReplace({ username: user.username }, retrievedUser);

    client.close();

    res.send("Reminder set");
  } catch (err) {
    debug(err);
  }
}

async function getReminder(req, res) {
  const { user } = req;
  const url = mongoConfig.db.host;
  const dbname = mongoConfig.db.name;

  try {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbname);

    const coll = await db.collection("users");
    const retrievedUser = await coll.findOne({ username: user.username });

    const { reminders } = retrievedUser;

    res.json(reminders);
  } catch (err) {
    debug(err);
  }
}

module.exports = { setReminder, getReminder };
