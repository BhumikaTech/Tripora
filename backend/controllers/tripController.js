const Trip = require("../models/Trip");

// Create a new trip
const createTrip = async (req, res) => {
    try {
        const {
            title,
            destination,
            startDate,
            endDate,
            budget
        } = req.body;

        // Create trip
        const trip = new Trip({
            title,
            destination,
            startDate,
            endDate,
            budget,

            // Assign logged-in user's ID
            user: req.user.id
        });

        // Save trip in MongoDB
        const savedTrip = await trip.save();

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            trip: savedTrip
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// Get all trips of the logged-in user
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            count: trips.length,
            trips
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get a single trip by ID
const getTripById = async (req, res) => {
    try {
        const { id } = req.params;

        const trip = await Trip.findOne({
            _id: id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            trip
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Update an existing trip

const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const { title, destination, startDate, endDate, budget } = req.body;

        const updatedTrip = await Trip.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            {
                title,
                destination,
                startDate,
                endDate,
                budget
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            trip: updatedTrip
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a trip
const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTrip = await Trip.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!deletedTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trip deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip
};