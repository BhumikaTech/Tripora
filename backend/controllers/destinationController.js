
const Destination = require("../models/Destination");

// 1. Get all destinations with search, filtering and sorting
const getDestinations = async (req, res) => {
    try {
        const { search, country, maxBudget, sort } = req.query;

        // Start with an empty filter
        let filter = {};

        // Search by destination name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by country
        if (country) {
            filter.country = {
                $regex: country,
                $options: "i"
            };
        }

        // Filter by maximum budget
        if (maxBudget !== undefined) {
            const budget = Number(maxBudget);

            if (!Number.isFinite(budget) || budget < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid maximum budget"
                });
            }

            filter.budgetPerDay = {
                $lte: budget
            };
        }

        // Create database query
        let query = Destination.find(filter);

        // Sort by budget
        if (sort === "low") {
            query = query.sort({ budgetPerDay: 1 });
        } else if (sort === "high") {
            query = query.sort({ budgetPerDay: -1 });
        }

        // Execute query
        const destinations = await query;

        res.status(200).json({
            success: true,
            count: destinations.length,
            destinations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 2. Get a single destination by ID
const getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;

        const destination = await Destination.findById(id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            destination
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 3. Create a destination
const createDestination = async (req, res) => {
    try {
        const {
            name,
            country,
            description,
            imageUrl,
            budgetPerDay
        } = req.body;

        const destination = new Destination({
            name,
            country,
            description,
            imageUrl,
            budgetPerDay
        });

        const savedDestination = await destination.save();

        res.status(201).json({
            success: true,
            message: "Destination created successfully",
            destination: savedDestination
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// 4. Update a destination
const updateDestination = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDestination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination updated successfully",
            destination: updatedDestination
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// 5. Delete a destination
const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDestination = await Destination.findByIdAndDelete(id);

        if (!deletedDestination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Export all controllers
module.exports = {
    getDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};
