const mongoose = require("mongoose");

const DvlaResponseSchema = new mongoose.Schema({
    numberPlate: { type: String, required: true, unique: true },
    dvlaResponse: { type: Object, required: true },
});

const DvlaResponse = mongoose.model("DvlaResponse", DvlaResponseSchema);

module.exports = DvlaResponse;
