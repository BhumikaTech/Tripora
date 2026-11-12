const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: ["Food", "Hotel", "Transport", "Shopping", "Other"]
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

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;