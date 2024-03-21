const mongoose = require("mongoose")

const testdata = mongoose.Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true }
});

module.exports = mongoose.model("TestData", testdata);