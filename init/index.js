const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user");

async function main() {
    const dbUrl = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/wanderlust';
    console.log("Connecting to Database...");
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await main();
    console.log("Connected to DB successfully!");

    const ownerUser = await User.findOne({ username: "Vishesh Ranjan" });
    if (!ownerUser) {
        throw new Error("Owner user 'Vishesh Ranjan' not found in database. Please register the user first.");
    }
    console.log(`Found owner user: ${ownerUser.username} (${ownerUser._id})`);

    await Listing.deleteMany({});
    console.log("Deleted existing listings.");

    // Map listings data to include the found owner
    const mappedData = initData.data.map((obj) => ({
        ...obj,
        owner: [ownerUser._id]
    }));

    // Seed the database
    const listings = await Listing.insertMany(mappedData);
    console.log(`Successfully seeded ${listings.length} listings.`);
};

initDB()
    .then(() => {
        mongoose.connection.close();
        console.log("Connection closed.");
    })
    .catch((err) => {
        console.error("Initialization failed:", err.message);
        mongoose.connection.close();
    });
