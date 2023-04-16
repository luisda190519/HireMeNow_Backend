const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

router.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName, cellphone } = req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            cellphone: cellphone,
        });
        await user.save();
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" });
            }
            return res.status(201).json(req.user);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {}
});

router.get("/:userID", async (req, res) => {
    const { userID } = req.params;
    const userExist = await User.findById(userID);
    if (userExist) {
        return res.json(userExist);
    }
    return res.json({ message: "user not finded" });
});

router.put("/fillProfile/:userID", async (req, res) => {
    const id = req.params.userID;
    const {
        role,
        location,
        description,
        experience,
        estudios,
        skills,
        idiomas,
    } = req.body;

    try {
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
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
