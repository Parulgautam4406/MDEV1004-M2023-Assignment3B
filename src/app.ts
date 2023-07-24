// app.ts
// Author: Parul Gautam
// Date: 23 July, 2023
import express, { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import routes from "./routes/router";
import config from "./configurations/configurations";
import logger from "./logger";
import cookieParser from "cookie-parser";

// modules for authentication
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";

// modules for jwt support
import cors from "cors";
import passportJWT from "passport-jwt";

// define JWT aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// authentication objects
let localStrategy = passportLocal.Strategy; // alias
import User from "./models/user";

const app = express();
const PORT = config.port;

// MongoDB connection
mongoose
    .connect(config.mongoURI)
    .then(() => {
        logger.info("Connected to MongoDB");
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// setup express session
app.use(
    session({
        secret: config.secret,
        saveUninitialized: false,
        resave: false,
    })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// implement an Auth Strategy
passport.use(User.createStrategy());
// serialize and deserialize user data
passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser());

// setup JWT Options
let jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
};

// setup JWT Strategy
let strategy = new JWTStrategy(jwtOptions, function (jwt_payload, done) {
    try {
        const user = User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

passport.use(strategy);

// Routes
app.use("/api/", routes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error("Error:", err.stack);
    res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);
