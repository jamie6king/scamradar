const mongoose = require("mongoose");
const { Schema } = mongoose;

const MapReviewsSchema = new Schema(
    {
        query: {
            type: String,
            required: true,
            index: true,
        },
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
        reviewsCount: {
            type: Number,
            required: true,
        },
        ratingSummary: {
            type: [],
            required: true,
        },
        mostRelevantReviews: {
            type: [],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MapReview = mongoose.model("MapReview", MapReviewsSchema);

module.exports = MapReview;
