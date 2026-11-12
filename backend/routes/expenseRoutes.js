
const express = require("express");
const router = express.Router();

const {
    addExpense,
    getTripExpenses,
    deleteExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

// Add expense to a particular trip
router.post("/:tripId", authMiddleware, addExpense);

// Get all expenses of a particular trip
router.get("/:tripId", authMiddleware, getTripExpenses);

// Delete a particular expense
router.delete("/:tripId/:expenseId", authMiddleware, deleteExpense);

module.exports = router;
