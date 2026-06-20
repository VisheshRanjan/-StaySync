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
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../public/uploads/listings");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
// const upload = multer({ storage });

const upload = multer({ dest: 'uploads/' })


router
    .route("/")
    .get(wrapAsync(routeController.index))
    .post(upload.single('listingImage'),(req,res)=>{
        res.send(req.file);
    })

router
    .route("/new")
    .get(isLogin, routeController.renderNewListing)
    .post(
        isLogin,
        upload.single("listing[image][file]"),
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
        upload.single("listing[image][file]"),
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
