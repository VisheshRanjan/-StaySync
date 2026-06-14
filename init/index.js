const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    await main();
    console.log("Connected to DB");

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"6a2dab65f2066815902612fa"}));
    const listings = await Listing.insertMany(initData.data);
    console.log(listings);
};

initDB()
    .then(() => mongoose.connection.close())
    .catch((err)=>{
        console.log(err);
        mongoose.connection.close();
    });
