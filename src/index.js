const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const Reclutador = require("./models/reclutadorModel");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobApplication");

//app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

//Base de datos
mongoose
    .connect(process.env.mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log(error));

// Configuracion
app.use(
    session({
        secret: process.env.secret,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                let user = await User.findOne({ email: email });
                if (!user) {
                    user = await Reclutador.findOne({ email: email });

                    if (!user) {
                        return done(null, false, {
                            message: "Incorrect email or password",
                        });
                    }

                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        return done(null, false, {
                            message: "Incorrect email or password",
                        });
                    } else {
                        return done(null, user);
                    }

                    return done(null, false, {
                        message: "Incorrect email or password",
                    });
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, {
                        message: "Incorrect email or password",
                    });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

// Passport Session Serialization
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
