
const TripPlan = require("../models/TripPlan");
const Trip = require("../models/Trip");

// 1. Add an activity to a trip
const addActivity = async (req, res) => {
    try {
        const { day, activity, location, time } = req.body;
        const { tripId } = req.params;

        // Check trip ownership
        const trip = await Trip.findOne({
            _id: tripId,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Create activity
        const newActivity = new TripPlan({
            day,
            activity,
            location,
            time,
            trip: tripId,
            user: req.user.id
        });

        const savedActivity = await newActivity.save();

        res.status(201).json({
            success: true,
            message: "Activity added successfully",
            activity: savedActivity
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// 2. Get all activities of a trip
const getTripPlan = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findOne({
            _id: tripId,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        const activities = await TripPlan.find({
            trip: tripId,
            user: req.user.id
        }).sort({ day: 1, time: 1 });

        res.status(200).json({
            success: true,
            count: activities.length,
            activities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addActivity,
    getTripPlan
};
