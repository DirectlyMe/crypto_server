const express = require("express");

const { setReminder, getReminder } = require("../controllers/user_controller");
const signIn = require("../utilities/signed_in");

const userRouter = express.Router();

function router() {
  userRouter.use(signIn);

  userRouter.route("/set-price-reminder").post(setReminder);

  userRouter.route("/get-price-reminders").get(getReminder);

  return userRouter;
}

module.exports = router;
