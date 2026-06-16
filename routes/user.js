const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signUp",(req,res)=>{
    res.render("../views/users/signUp.ejs");
});

router.post("/signUp",async(req,res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(error)=>{
            if(error) {
                throw error;
                next(error);
            }
                    res.redirect("/listings");
        });
    } catch (e) {
        console.error(e);
        res.redirect("/signUp");
    }
});

router.get("/login",(req,res)=>{
    res.render("../views/users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    try{
        req.flash("success","You're Logged in ..");
req.session.success = "Welcome to Wanderlust";
let redirectUrl = res.locals.redirectUrl || res.redirect("/listings");
    // return res.redirect(redirectUrl);
    }catch(error){
                console.log("The prob is :");

        console.log(error);
    };

});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("listings");
  });
});

module.exports= router;