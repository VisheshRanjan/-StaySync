const mongoose = require("mongoose");
const { ref } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage",
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
            set: (v) =>
                v && v.trim()
                    ? v
                    : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
        },
    },
    price:{
        type : Number,
        required :true,
    },
    location:{
        type:String,

    },
    country:{ type:String
},
category: {
    type: String,
    enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Boats",
        "Luxury",
        "Beach"
    ]
},
geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
	reviews: [
            {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
        owner:[{
            type:Schema.Types.ObjectId,
            ref:"User"
        }]
	});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
