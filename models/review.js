const mongoose = require("mongoose");
const { type, min, max } = require("../schema");
const { required, ref } = require("joi");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },author:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);
