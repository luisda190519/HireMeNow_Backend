const mongoose = require("mongoose");

const reclutadorSchema = new mongoose.Schema({
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

    jobPublished: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            default: "",
        },
    ],
});

const Reclutador = mongoose.model("Reclutador", reclutadorSchema);

module.exports = Reclutador;
