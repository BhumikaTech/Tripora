
const express = require("express");
const router = express.Router();

const {
    addActivity,
    getTripPlan
} = require("../controllers/tripPlanController");

const authMiddleware = require("../middleware/authMiddleware");

// Add activity
router.post("/:tripId", authMiddleware, addActivity);

// Get trip itinerary
router.get("/:tripId", authMiddleware, getTripPlan);

module.exports = router;
