const mongoose = require("mongoose");

const DvsaResponseSchema = new mongoose.Schema({
    numberPlate: { type: String, required: true, unique: true },
    dvsaResponse: { type: Object, required: true },
});

const DvsaResponse = mongoose.model("DvsaResponse", DvsaResponseSchema);

module.exports = DvsaResponse;
