const mongoose = require("mongoose");
const { Schema } = mongoose;

const MapReviewsSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true,
        },
        businessAddress: {
            type: String,
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
