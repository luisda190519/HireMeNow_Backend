const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    if (id) {
        const user = await User.findById(id);
        done(null, user);
    }
});

passport.use(
    "local-signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const { firstName, lastName, cellphone, role } = req.body;
                const user = await User.findOne({ email: email });
                if (user) {
                    return done(null, false, {
                        message: "Email already exists",
                    });
                } else {
                    const newUser = new User({
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        cellphone: cellphone,
                        isRecruiter: role === "user" ? false : true,
                    });
                    await newUser.save();
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "User not Found" });
            }
            if (!user.comparePassword(password)) {
                return done(null, false, { message: "Incorrect password" });
            }
            done(null, user);
        }
    )
);

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                let user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, {
                        message: "Incorrect email or password",
                    });
                }

                const match = await user.comparePassword(password);
                if (!match) {
                    return done(null, false, {
                        message: "Incorrect email or password",
                    });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
            }
        }
    )
);
