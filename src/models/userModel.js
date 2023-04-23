const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
        default: ""
    },
    location: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: false,
        default: ""
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
    jobPublished: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            default: "",
        },
    ],
    isRecruiter: {
        type: Boolean,
        required: true,
    },
    image: {
        publicId: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,  
        },
    },
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
