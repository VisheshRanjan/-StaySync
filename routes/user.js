const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signUp")
.get(userController.renderSignUp)
.post(userController.postSignUp);



router.route("/login")
.get(userController.renderLoginPage)
.post(saveRedirectUrl, passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.postLogin);

router.route("/logout")
.get(userController.logOut);

module.exports= router;