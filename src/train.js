const mongoose = require("mongoose")

const child = mongoose.Schema({
    station_id: { type: Number, required: true },
    arrival_time: { type: String },
    departure_time: { type: String },
    fare: { type: Number, required: true },
})

const testdata = mongoose.Schema({
    train_id: { type: Number, required: true },
    train_name: { type: String, required: true },
    capacity: { type: Number, required: true },
    stops: [child],
});

module.exports = mongoose.model("Train", testdata);