const express = require("express");
const router = express.Router();

const {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTrip);

router.get("/my-trips", authMiddleware, getMyTrips);
// Get a single trip by ID
router.get("/:id", authMiddleware, getTripById);
// Update a trip
router.put("/:id", authMiddleware, updateTrip);
// Delete a trip
router.delete("/:id", authMiddleware, deleteTrip);

module.exports = router;