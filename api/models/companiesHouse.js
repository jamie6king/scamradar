const mongoose = require("mongoose");

const CompaniesHouseSchema = new mongoose.Schema({
    bussinessNumber: { type: String, ref: "listing", required: true },
    businessInfo: { type: Object, required: true },
});

const CompaniesHouse = mongoose.model("CompaniesHouse", CompaniesHouseSchema);

module.exports = CompaniesHouse;
