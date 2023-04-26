const User = require("../models/userModel");
const Job = require("../models/jobModel");
const controller = {};

controller.addJobApplication = async (req, res) => {
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

        const jobApplicationIndex = user.jobApplications.findIndex(
            (application) => application.job.equals(job._id)
        );

        if (jobApplicationIndex !== -1) {
            user.jobApplications[jobApplicationIndex].state =
                1 - user.jobApplications[jobApplicationIndex].state;
            const index2 = job.usuariosAplicados.indexOf(user._id);
            job.usuariosAplicados.splice(index2, 1);
        } else {
            user.jobApplications.push({ job: job._id, state: 1 });
            job.usuariosAplicados.push(userID);
        }

        await user.save();
        await job.save();
        res.json({ message: message });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

controller.addJobLike = async (req, res) => {
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
};

controller.addNewJob = async (req, res) => {
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
        const user = await User.findById(owner);
        user.jobPublished.push(savedJob._id);
        await user.save();
        res.json(savedJob);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

controller.searchJobByQuery = async (req, res) => {
    const query = req.query.q;

    try {
        const jobs = await Job.find({
            title: { $regex: query, $options: "i" },
        });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

controller.searchJobByLocation = async (req, res) => {
    const location = req.params.location;
    try {
        const jobs = await Job.find({
            location: { $regex: location, $options: "i" },
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
};

controller.searchJobByTitleCompanyAndLocation = async (req, res) => {
    const { title, location } = req.query;
    const jobs = await Job.find({
        title: new RegExp(title, "i"),
        location: new RegExp(location, "i"),
    });
    res.json(jobs);
};

controller.searchJobByTitleAndLocation = async (req, res) => {
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
};

controller.searchJobByTitle = async (req, res) => {
    const { title } = req.params;

    try {
        const jobs = await Job.find({
            title: { $regex: new RegExp(title, "i") },
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

controller.getRandomJobs = async (req, res) => {
    try {
        const jobs = await Job.aggregate([{ $sample: { size: 7 } }]);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

controller.getPostuladosByJobID = async (req, res) => {
    try {
        const jobID = req.params.jobID;
        const trabajo = await Job.findById(jobID).populate("usuariosAplicados");

        if (!trabajo) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(trabajo.usuariosAplicados);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

controller.getJobsPostuladosByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const usuario = await User.findById(userID).populate({
            path: "jobApplications",
            populate: {
                path: "job",
            },
        });

        if (!usuario) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobs = usuario.jobApplications.map((application) => {
            const job = application.job.toObject();
            return {
                ...job,
                state: application.state,
            };
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

controller.updateJobApplicationState = async (req, res) => {
    try {
        const { userID, jobID, state } = req.body;

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobIndex = user.jobApplications.findIndex(
            (application) => application.job.toString() === jobID
        );

        if (jobIndex === -1) {
            return res
                .status(404)
                .json({ message: "JobApplication not found" });
        }

        if (state > user.jobApplications[jobIndex].state) {
            user.jobApplications[jobIndex].state = state;
            await user.save();
        }

        res.json({ message: "JobApplication state updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = controller;
