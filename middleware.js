const Listing = require("./models/listing.js");
const {listingSchema,reviewSchema,validateSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");


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
        const listing =await Listing.findById(_id);
        if(!listing.owner[0].equals(res.locals.currUser._id)){
req.flash("error","You're not the Owner!");
            return res.redirect("/listings");
        }
        next();
}

module.exports. validateSchema=(req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else{
        next();
    }
};

// module.exports.isAuthor =(req,res,next)=>{
    
// }