
const express = require("express");

const router = express.Router();

const {
    getDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
} = require("../controllers/destinationController");

// GET all destinations
router.get("/", getDestinations);

// GET one destination by ID
router.get("/:id", getDestinationById);

// POST create destination
router.post("/", createDestination);

router.put("/:id", updateDestination);

router.delete("/:id", deleteDestination);

module.exports = router;
