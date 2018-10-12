const express = require("express");
const passport = require("passport");

const adminRoutes = express.Router();

function router() {
  adminRoutes.post(
    "/signIn",
    passport.authenticate("google-strategy", {
      failWithError: "Authentication Rejected"
    }),
    (req, res) => {
      res.send("authenticated");
    }
  );

  return adminRoutes;
}

module.exports = router;
