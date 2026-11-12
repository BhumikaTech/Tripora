const mongoose = require("mongoose");

const tripPlanSchema = new mongoose.Schema({

    day: {
        type: Number,
        required: true,
        min: 1
    },

    activity: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    time: {
        type: String
    },

    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const TripPlan = mongoose.model("TripPlan", tripPlanSchema);

module.exports = TripPlan;