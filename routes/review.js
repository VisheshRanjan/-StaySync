const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLogin,validateReview,isAuthor} = require("../middleware.js");
const {listingSchema,reviewSchema} = require("../schema.js");



router.post("/",validateReview,isLogin,wrapAsync(async (req,res)=>{
        let {_id} = req.params;
    let listing = await Listing.findById(_id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
  req.flash("success","REVIEW ADDED!");

    res.redirect(`/listings/${_id}`);
}));


router.delete("/:reviewId/delete",isLogin,isAuthor,wrapAsync(async(req,res,next)=>{
    let{_id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(_id,{$pull:{reviews:reviewId}}).then(result =>{
        console.log("Reference ObjId :",result);
    });
    await Review.findByIdAndDelete(reviewId).then(result =>{
        console.log("Actual Review Deleted:",result);
    });
                req.flash("success","REVIEW EDITED!");
    res.redirect(`/listings/${_id}`);

}));

module.exports = router;