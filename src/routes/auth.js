const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  getUserByID,
  getJobLikesByUserID,
  fillProfile,
  logout,
} = require('../controller/auth');

// Post routes
router.post('/signup', signUp);
router.post('/login', login);

// Put routes
router.put('/fillProfile/:userID', fillProfile);

// Get routes
router.get('/:userID', getUserByID);
router.get('/jobLikes/:userID', getJobLikesByUserID);
router.get('/logout', logout);

module.exports = router;
