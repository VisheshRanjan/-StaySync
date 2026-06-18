module.exports.renderSignUp = (req,res)=>{
    res.render("../views/users/signUp.ejs");
}


module.exports.postSignUp = async(req,res)=>{
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
}



module.exports.renderLoginPage = (req,res)=>{
    res.render("../views/users/login.ejs");
}



module.exports.postLogin = (req,res)=>{
    try{
        req.flash("success","You're Logged in ..");
req.session.success = "Welcome to Wanderlust";
let redirectUrl = res.locals.redirectUrl || res.redirect("/listings");
return res.redirect(redirectUrl);
    }catch(error){
                console.log("The prob is :");

        console.log(error);
    };

}




module.exports.logOut = function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("listings");
  });
}