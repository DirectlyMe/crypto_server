const express = require("express");
const passport = require("passport");
const debug = require("debug")("app:auth_routes");

const adminRoutes = express.Router();

function router() {
  adminRoutes.get(
    "/signIn",
    passport.authenticate("google-strategy", {
      failWithError: "Authentication Rejected"
    }),
    (req, res) => {
      debug("User authenticated");
      debug(req.user);
      res.send("authenticated");
    }
  );

  return adminRoutes;
}

module.exports = router;
