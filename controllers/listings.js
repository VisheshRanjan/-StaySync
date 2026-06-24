const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const  mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const hasCoordinates = (geometry) =>
    Array.isArray(geometry?.coordinates) && geometry.coordinates.length === 2;


module.exports.index = async (req,res)=>{
    let allList = await Listing.find({})
    res.render("../views/listings/index.ejs",{allList});

}

module.exports.renderNewListing= (req,res)=>{
  res.render("newListing.ejs",{success:"Saved Here!"});
}


module.exports.createNewListing= async (req,res,next)=>{

let response = await geoCodingClient.forwardGeocode({
    query:req.body.listing.location,
    limit:1
}).send();

const geometry = response.body.features?.[0]?.geometry;
if (!geometry) {
    req.flash("error", "We could not find that location. Please enter a more specific location.");
    return res.redirect("/listings/new");
}
    
    let newListing = new Listing(req.body.listing);
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    newListing.owner= req.user._id;
    newListing.geometry = geometry;
    await newListing.save();
            req.flash("success","NEW LISTING CREATED!");
        res.redirect("/listings");
}




module.exports.allListingShow =async (req,res)=>{
    let {_id} = req.params;
    let allList = await Listing.findById(_id)
    .populate({
        path: "reviews",
                    populate: {
                        path: "author"
        }
}).populate("owner");

    let mapError = null;
    if (!hasCoordinates(allList?.geometry)) {
        try {
            const response = await geoCodingClient.forwardGeocode({
                query: [allList?.location, allList?.country].filter(Boolean).join(", "),
                limit: 1,
            }).send();
            const geometry = response.body.features?.[0]?.geometry;

            if (hasCoordinates(geometry)) {
                allList.geometry = geometry;
                await allList.save();
            } else {
                mapError = "We could not find coordinates for this listing.";
            }
        } catch (error) {
            console.error("Unable to geocode listing for map:", error.message);
            mapError = "The map location is unavailable right now.";
        }
    }

    res.render("../views/listings/show.ejs",{allList, mapError});
   
}




module.exports.renderEditListingPage = async (req,res)=>{
    let{_id} = req.params;
    let user = await Listing.findById(_id);
    res.render("edit.ejs",{user});
}

module.exports.editListing = async(req,res)=>{
    let{_id} = req.params;
        const listing =await Listing.findById(_id);
        console.log(listing);
        if (req.file) {
            req.body.listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }
        await Listing.findByIdAndUpdate(_id,req.body.listing);
                        req.flash("success","LISTING EDITED!");
    res.redirect("/listings");

}



module.exports.destroyListing = async (req,res)=>{
    let{_id} =req.params;
    let delUser = await Listing.findByIdAndDelete(_id);
    
    console.log(delUser);
                req.flash("success","LISTING DELETED!");
    res.redirect("/listings");
}
