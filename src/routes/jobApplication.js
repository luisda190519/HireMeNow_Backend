const express = require('express');
const router = express.Router();
const {
  addJobApplication,
  addJobLike,
  addNewJob,
  searchJobByQuery,
  searchJobByLocation,
  searchJobByTitleCompanyAndLocation,
  searchJobByTitleAndLocation,
  searchJobByTitle,
  getRandomJobs,
  getPostuladosByJobID,
  getJobsPostuladosByUserID,
  updateJobApplicationState
} = require('../controller/jobApplication');

// Post routes
router.post('/postular/:jobID/user/:userID', addJobApplication);
router.post('/like/:jobID/user/:userID', addJobLike);
router.post('/postJob', addNewJob);

// Get routes
router.get('/search', searchJobByQuery);
router.get('/location/:location', searchJobByLocation);
router.get(
  '/title/:title/company/:company/location/:location',
  searchJobByTitleCompanyAndLocation
);
router.get('/title/:title/place/:location', searchJobByTitleAndLocation);
router.get('/title/:title', searchJobByTitle);
router.get('/randomJobs', getRandomJobs);
router.get('/postulados/job/:jobID', getPostuladosByJobID)
router.get('/postulaciones/job/:userID', getJobsPostuladosByUserID)
router.get('/', getRandomJobs);

//Put request
router.put('/editState', updateJobApplicationState)
module.exports = router;
