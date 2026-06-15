const Listing = require("./models/listing.js");

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

module.exports.isOwner =async (req,res,next)=>{      
    let{_id} = req.params;
        const newInfo =req.body.listing;
        const listing =await Listing.findById(_id);
        if(!listing.owner[0].equals(res.locals.currUser._id)){
        req.session.error = "Sorry, you're not the owner!"; 
            return res.redirect("/listings");
        }
        next();
}