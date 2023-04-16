const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Job = require("../models/jobModel");

router.get("/:jobID", async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobID);
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/postJob", async (req, res) => {
    try {
        const {
            title,
            location,
            company,
            description,
            rating,
            publishTime,
            requirements,
            tags,
        } = req.body;

        const job = new Job({
            title,
            location,
            company,
            description,
            rating,
            publishTime,
            requirements,
            tags,
        });

        const savedJob = await job.save();
        res.json(savedJob);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get("/search", async (req, res) => {
    const query = req.query.q;

    try {
        const jobs = await Job.find({
            title: { $regex: query, $options: "i" },
        });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:location", async (req, res) => {
    const location = req.params.location;
    try {
        const jobs = await Job.find({
            location: { $regex: location, $options: "i" },
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/jobs", async (req, res) => {
    const { title, location } = req.query;
    const jobs = await Job.find({
        title: new RegExp(title, "i"),
        location: new RegExp(location, "i"),
    });
    res.json(jobs);
});

module.exports = router;
