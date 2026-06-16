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




router.get("/", wrapAsync(routeController.index));

router.get("/new",isLogin,routeController.renderNewListing);

router.post("/new",isLogin, validateSchema, wrapAsync(routeController.createNewListing));
router.get("/:_id", wrapAsync(routeController.allListingShow));

router.get("/:_id/edit",isLogin,isOwner, wrapAsync(routeController.renderEditListingPage));
router.put("/:_id/edit",isLogin,isOwner,validateSchema, wrapAsync(routeController.editListing));

router.post("/:_id/delete",isLogin,isOwner, wrapAsync(routeController.destroyListing));

module.exports= router;
