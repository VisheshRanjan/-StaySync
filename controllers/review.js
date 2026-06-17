const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.showReview =async (req,res)=>{
        let {_id} = req.params;
    let listing = await Listing.findById(_id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
  req.flash("success","REVIEW ADDED!");

    res.redirect(`/listings/${_id}`);
}



module.exports.destroyReview =async(req,res,next)=>{
    let{_id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(_id,{$pull:{reviews:reviewId}}).then(result =>{
        console.log("Reference ObjId :",result);
    });
    await Review.findByIdAndDelete(reviewId).then(result =>{
        console.log("Actual Review Deleted:",result);
    });
                req.flash("success","REVIEW EDITED!");
    res.redirect(`/listings/${_id}`);

}


