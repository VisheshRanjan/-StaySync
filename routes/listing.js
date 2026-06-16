const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLogin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateSchema} = require("../middleware.js");






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

router.get("/:_id/edit",isLogin,isOwner, wrapAsync(async (req,res)=>{
    let{_id} = req.params;
    let user = await Listing.findById(_id);
    res.render("edit.ejs",{user});
}));

router.put("/:_id/edit",isLogin,isOwner,validateSchema, wrapAsync(async(req,res)=>{
    let{_id} = req.params;
        const listing =await Listing.findById(_id);
        console.log(listing);
        await Listing.findByIdAndUpdate(_id,req.body.listing);
                        req.flash("success","LISTING EDITED!");
    res.redirect("/listings");

}));

router.post("/:_id/delete",isLogin,isOwner, wrapAsync(async (req,res)=>{
    let{_id} =req.params;
    let delUser = await Listing.findByIdAndDelete(_id);
    
    console.log(delUser);
                req.flash("success","LISTING DELETED!");
    res.redirect("/listings");
}));

module.exports= router;
