
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// 1. Add a new expense
const addExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;
        const { tripId } = req.params;

        // Validate required fields
        if (!title || !amount || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, amount and category"
            });
        }

        if (Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than zero"
            });
        }

        // Check whether trip belongs to logged-in user
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

        const expense = await Expense.create({
            title: title.trim(),
            amount: Number(amount),
            category,
            trip: tripId,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 2. Get all expenses of a trip
const getTripExpenses = async (req, res) => {
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

        const expenses = await Expense.find({
            trip: tripId,
            user: req.user.id
        }).sort({ createdAt: -1 });

        const totalExpense = expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );

        const remainingBudget = trip.budget - totalExpense;

        // Calculate category-wise expenses
        const categorySummary = await Expense.aggregate([
            {
                $match: {
                    trip: trip._id,
                    user: trip.user
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: expenses.length,
            totalExpense,
            remainingBudget,
            categorySummary,
            expenses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 3. Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const { tripId, expenseId } = req.params;

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

        // Delete only the expense belonging to this trip and user
        const expense = await Expense.findOneAndDelete({
            _id: expenseId,
            trip: tripId,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addExpense,
    getTripExpenses,
    deleteExpense
};
