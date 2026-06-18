const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLogin,validateReview,isAuthor} = require("../middleware.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const reviewController = require("../controllers/review.js");

router.route("/")
.post(validateReview,isLogin,wrapAsync(reviewController.showReview));

router.route("/:reviewId/delete")
.delete(isLogin,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;