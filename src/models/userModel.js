const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cellphone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    experience: [{ type: String, required: false, default: "" }],
    estudios: [{ type: String, required: false, default: "" }],
    skills: [{ type: String, required: false, default: "" }],
    idiomas: [{ type: String, required: false, default: "" }],

    jobApplications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            default: "",
        },
    ],
    jobLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            default: "",
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
