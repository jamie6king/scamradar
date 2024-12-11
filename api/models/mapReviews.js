const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const MapReviewsSchema = new Schema(
    {
        businessNumber: {
            type: Number,
            ref: "Company",
            required: true,
        },
        averageRating: {
            type: Number,
            required: true,
        },
        ratingSummary: {
            type: Object, // Would this be better as a nested schema? It was looking quite time consuming to create.
            required: true,
        },
        mostRelevantReviews: {
            type: Object, // Would this be better as a nested schema? It was looking quite time consuming to create.
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        otherInfo: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const MapReview = mongoose.model("MapReview", MapReviewsSchema);

module.exports = MapReview;
