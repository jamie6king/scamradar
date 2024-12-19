const mongoose = require("mongoose");

const LicensePlateImageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
            index: true,
        },
        licensePlatesInImage: {
            type: [],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const LicensePlateImage = mongoose.model(
    "LicensePlateImage",
    LicensePlateImageSchema
);

module.exports = LicensePlateImage;
