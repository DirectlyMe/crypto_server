const express = require("express");
const passport = require("passport");
const debug = require("debug")("app:auth_routes");
const { spawn, exec } = require("child_process");


const authRoutes = express.Router();

function router() {
  authRoutes.post(
    "/signIn",
    passport.authenticate("google-strategy", {
      failWithError: "Authentication Rejected"
    }),
    (req, res) => {
      debug(`${req.user} Authenticated`);
      res.json("authenticated");
    }
  );

  // not working
  authRoutes.route("/run-models").get(async (req, res) => {
    await exec("pipenv shell");
    spawn("pipenv run python3.6", ["models/main.py"]);
    res.send("Models running, this will take somewhere around 15 minutes");
  });


  return authRoutes;
}

module.exports = router;
