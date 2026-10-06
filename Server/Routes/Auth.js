const express = require("express");
const router = express.Router();

const {
  
  register,
  login,
  activateAccount,forgotPassword, resetPassword
} = require("../controllers/auth-controllers");

const { signupSchema } = require("../validators/auth-validators");
const validate = require("../middleware/validate");



// Register with validation
router.route("/register").post(validate(signupSchema), register);

// Login route
router.route("/login").post(login);

// Account activation route (no validation assumed here, can add if you want)
router.route("/activate").post(activateAccount);



router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);


module.exports = router;
