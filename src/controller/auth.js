const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require("passport");
const controller = {};

controller.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, cellphone, role } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isRecruiter = role === 'user' ? false : true;
    const user = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      cellphone: cellphone,
      isRecruiter,
    });
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.send(info);
      else {
        return res.send(user);
      }
    })(req, res, next);
  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: 'Server Error' });
  }
};

controller.login = (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
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
  return res.json({ message: 'user not finded' });
};

controller.getJobLikesByUserID = async (req, res) => {
  try {
    const userID = req.params.userID;
    const user = await User.findById(userID).populate('jobLikes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobLikes = user.jobLikes;

    res.json({ jobLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

controller.fillProfile = async (req, res) => {
  const id = req.params.userID;
  const { role, location, description, experience, estudios, skills, idiomas } =
    req.body;

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
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

controller.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
};

module.exports = controller;
