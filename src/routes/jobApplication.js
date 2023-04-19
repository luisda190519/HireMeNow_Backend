const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Job = require("../models/jobModel");

router.post("/postular/:jobID/user/:userID", async (req, res) => {
    try {
        const { jobID, userID } = req.params;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const job = await Job.findById(jobID);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        user.jobApplications.push(jobID);
        await user.save();
        res.json({ message: "worked" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/like/:jobID/user/:userID", async (req, res) => {
    try {
        const { jobID, userID } = req.params;
        let message = false;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const job = await Job.findById(jobID);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        if (user.jobLikes.includes(job._id)) {
            const index = user.jobLikes.indexOf(job._id);
            if (index !== -1) {
                user.jobLikes.splice(index, 1);
            }
        } else {
            user.jobLikes.push(jobID);
            message = true;
        }

        await user.save();
        res.json({ message: message });
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
            image,
            owner,
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
            image,
            owner,
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

router.get("/location/:location", async (req, res) => {
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

router.get(
    "/title/:title/company/:company/location/:location",
    async (req, res) => {
        const { title, location } = req.query;
        const jobs = await Job.find({
            title: new RegExp(title, "i"),
            location: new RegExp(location, "i"),
        });
        res.json(jobs);
    }
);

router.get("/title/:title/place/:location", async (req, res) => {
    const { title, location } = req.params;

    try {
        const jobs = await Job.find({
            $or: [
                { title: { $regex: new RegExp(title, "i") } },
                { location: { $regex: new RegExp(location, "i") } },
            ],
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/title/:title", async (req, res) => {
    const { title } = req.params;

    try {
        const jobs = await Job.find({
            title: { $regex: new RegExp(title, "i") },
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/randomJobs", async (req, res) => {
    try {
        const jobs = await Job.aggregate([{ $sample: { size: 7 } }]);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
