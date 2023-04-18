const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    publishTime: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requirements: [{ type: String, required: false, default: "" }],
    tags: [{ type: String, required: false, default: "" }],
});

const Job = mongoose.model("JobApplication", jobSchema);

module.exports = Job;
