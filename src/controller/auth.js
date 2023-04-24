const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const passport = require("passport");
const { upload } = require("../cloudinary");
const controller = {};

controller.signUp = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, cellphone, role } =
            req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const isRecruiter = role === "user" ? false : true;
        const user = new User({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            cellphone: cellphone,
            isRecruiter,
        });
        passport.authenticate("local-signup", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.send(info);
            else {
                return res.send(user);
            }
        })(req, res, next);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

controller.login = (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.send(info);
        else {
            req.logIn(user, (e) => {
                if (e) next(e);
                res.send(user);
            });
        }
    })(req, res, next);
};

controller.getUserByID = async (req, res) => {
    const { userID } = req.params;
    const userExist = await User.findById(userID);
    if (userExist) {
        return res.json(userExist);
    }
    return res.json({ message: "user not finded" });
};

controller.getJobLikesByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID).populate("jobLikes");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.jobLikes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

controller.getJobPostedByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID).populate("jobPublished");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobLikes = user.jobPublished;

        res.json(user.jobPublished);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

controller.fillProfile = async (req, res) => {
    const id = req.params.userID;
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Failed to upload image" });
            }

            const userBefore = await User.findById(id);
            const imageURL = req.file ? req.file.path : userBefore.image;
            const role = req.body.role.length > 0 ? req.body.role : null;
            const location =
                req.body.location.length > 0 ? req.body.location : null;
            const description =
                req.body.description.length > 0 ? req.body.description : null;
            const skills = req.body.skills ? req.body.skills.split(",") : [];
            const experience = req.body.experience
                ? req.body.experience.split(",")
                : [];
            const estudios = req.body.estudios
                ? req.body.estudios.split(",")
                : [];
            const idiomas = req.body.idiomas ? req.body.idiomas.split(",") : [];

            const user = await User.findByIdAndUpdate(
                id,
                {
                    role,
                    location,
                    description,
                    experience,
                    estudios,
                    skills,
                    idiomas,
                    image: imageURL,
                },
                { new: true }
            );


            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

controller.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/login");
};

module.exports = controller;
