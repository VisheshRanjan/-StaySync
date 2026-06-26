const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "public")));
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema,validateSchema} = require("./schema.js");
const Review = require("./models/review.js");
const isLogin = require("./middleware.js");
const isOwner = require("./middleware.js");
const dbUrl = process.env.MONGO_ATLAS_URL;
const { MongoStore } = require("connect-mongo");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const flash = require("connect-flash");

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24* 3600,
});

store.on("error",(err)=>{
    console.log("Error IN MONGO SESSION STORE", err);
});

const sessionOption = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(sessionOption));

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");


main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};


app.listen(8080,(req,res)=>{
    console.log("App is Listening");
        console.log(process.env.MONGO_ATLAS_URL);

});
app.use("/listings",listingsRouter);

app.use("/listings/:_id/reviews",reviewsRouter);
app.use("/",userRouter);



app.use((req,res,next)=>{
    next(new expressError(404,"Page Not Found"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message} = err;
    res.status(statusCode).render("error.ejs",{err});
});
