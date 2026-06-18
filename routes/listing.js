const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLogin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateSchema} = require("../middleware.js");
const routeController = require("../controllers/listings.js");


router
    .route("/")
    .get(wrapAsync(routeController.index));

router
    .route("/new")
    .get(isLogin, routeController.renderNewListing)
    .post(
        isLogin,
        validateSchema,
        wrapAsync(routeController.createNewListing)
    );

router
    .route("/:_id")
    .get(wrapAsync(routeController.allListingShow));

router
    .route("/:_id/edit")
    .get(
        isLogin,
        isOwner,
        wrapAsync(routeController.renderEditListingPage)
    )
    .put(
        isLogin,
        isOwner,
        validateSchema,
        wrapAsync(routeController.editListing)
    );

router
    .route("/:_id/delete")
    .post(
        isLogin,
        isOwner,
        wrapAsync(routeController.destroyListing)
    );

module.exports = router;