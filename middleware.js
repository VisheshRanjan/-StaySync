module.exports.isLogin =(req,res,next)=>{       
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Log-In First ");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{      
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
next();
}