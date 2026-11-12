
const mongoose = require("mongoose");

// Define destination structure
const destinationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    imageUrl: {
        type: String
    },

   budgetPerDay: {
    type: Number,
    required: true,
    min: [0, "Budget cannot be negative"]
   }
}, { timestamps: true });

// Create model
const Destination = mongoose.model("Destination", destinationSchema);

// Export model
module.exports = Destination;
