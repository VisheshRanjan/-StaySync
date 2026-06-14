const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLogin} = require("../middleware.js");





const validateSchema=(req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else{
        next();
    }
};


router.get("/", wrapAsync(async (req,res)=>{
    let allList = await Listing.find({})
    res.render("../views/listings/index.ejs",{allList});

}));

router.get("/new",isLogin,(req,res)=>{

    res.render("newListing.ejs",{success:"Saved Here!"});
});

router.post("/new",isLogin, validateSchema, wrapAsync( async (req,res,next)=>{

    let newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
            req.flash("success","NEW LISTING CREATED!");
        res.redirect("/listings");
}));
router.get("/:_id", wrapAsync(async (req,res)=>{
    let {_id} = req.params;
    let allList = await Listing.findById(_id).populate("reviews").populate("owner");
    console.log(allList);
                    req.flash("success","LISTING FOUND!");
    res.render("../views/listings/show.ejs",{allList});
   
}));

router.get("/:_id/edit",isLogin, wrapAsync(async (req,res)=>{
    let{_id} = req.params;
    let user = await Listing.findById(_id);
    res.render("edit.ejs",{user});
}));

router.put("/:_id/edit",validateSchema, wrapAsync(async(req,res)=>{
    let{_id} = req.params;
        const newInfo =req.body.listing;
        console.log(newInfo);
        await Listing.findByIdAndUpdate(_id,newInfo);
                        req.flash("success","LISTING EDITED!");
    res.redirect("/listings");

}));

router.post("/:_id/delete",isLogin, wrapAsync(async (req,res)=>{
    let{_id} =req.params;
    let delUser = await Listing.findByIdAndDelete(_id);
    
    console.log(delUser);
                req.flash("success","LISTING DELETED!");
    res.redirect("/listings");
}));

module.exports= router;