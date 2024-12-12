const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const ListingsSchema = new Schema({
    productId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    isAuction: {
        type: Boolean,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    isBusiness: {
        type: Boolean,
        required: true,
    },
    companiesHouseId: {
        type: ObjectId,
        ref: "CompaniesHouse",
    },
    hasReviews: {
        type: Boolean,
        required: true,
    },
    mapReviewsId: {
        type: ObjectId,
        ref: "MapReview",
    },
});

const Listing = mongoose.model("Listings", ListingsSchema);

module.exports = Listing;
