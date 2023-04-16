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
            return res
                .status(201)
                .json({ message: "User created successfully" });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    return res.status(200).json({ message: "Login successful" });
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
