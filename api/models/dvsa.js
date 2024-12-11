const mongoose = require("mongoose");

const DvsaTokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
});

const DvsaToken = mongoose.model("DvsaToken", DvsaTokenSchema);

module.exports = DvsaToken;
