const passport = require("passport");
const { Strategy } = require("passport-custom");
const { OAuth2Client } = require("google-auth-library");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:google.strategy");

const mongoConfig = require("../mongo_config");
const { clientID } = require("../api_keys");

const authClient = new OAuth2Client(clientID);

async function getUser(username, done) {
  const url = mongoConfig.db.host;
  const db = mongoConfig.db.name;

  let client;

  try {
    client = await MongoClient.connect(url);
    debug("Connected to mongo server");

    const database = await client.db(db);
    const col = await database.collection("users");
    let user = await col.findOne({ username });

    if (user !== null) {
      done(null, user);
    } else {
      col.insertOne({ username });
      user = await col.findOne({ username });
      done(null, user);
    }
  } catch (err) {
    debug(err.stack);
  }

  client.close();
}

function googleStrategy() {
  passport.use(
    "google-strategy",
    new Strategy(async (req, done) => {
      try {
        const { tokenID, username } = req.body;

        const ticket = await authClient.verifyIdToken({
          idToken: tokenID,
          audience: clientID
        });

        const payload = ticket.getPayload();

        if (payload.email_verified === true) {
          getUser(username, done);
        } else {
          done(null, false);
        }
      } catch (err) {
        debug(err);
        done(null, false);
      }
    })
  );
}

module.exports = googleStrategy;
