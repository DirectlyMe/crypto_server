const express = require("express");
const passport = require("passport");
const debug = require("debug")("app:auth_routes");

const adminRoutes = express.Router();

function router() {
  adminRoutes.post(
    "/signIn",
    passport.authenticate("google-strategy", {
      failWithError: "Authentication Rejected"
    }),
    (req, res) => {
      debug("User authenticated");
      res.send("authenticated");
    }
  );

  return adminRoutes;
}

module.exports = router;
