const mongoose = require("mongoose");

const DvlaResponseSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    response: { type: Object, required: true },
});

const DvlaResponse = mongoose.model("DvlaResponse", DvlaResponseSchema);

module.exports = DvlaResponse;
