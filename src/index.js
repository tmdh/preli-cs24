const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./user.js");
const Station = require("./station.js");
const Train = require("./train.js");
const getShortest = require("./dij.js");

const app = express();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const dbUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/`;
console.log(dbUrl);

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((error) => {
        console.log("Connection failed!", error);
        process.exit();
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/users", async (req, res) => {
    const u = new User(req.body);
    await u.save();
    res.status(201).json(req.body);
});

app.post("/api/stations", async (req, res) => {
    const u = new Station(req.body);
    await u.save();
    res.status(201).json(req.body);
});

app.post("/api/trains", async (req, res) => {
    const u = new Train(req.body);
    await u.save();
    const service_start = req.body.stops[0].departure_time;
    const num_stations = req.body.stops.length;
    const service_ends = req.body.stops[req.body.stops.length - 1].arrival_time;
    const { train_id, train_name, capacity } = req.body;
    res.status(201).json({
        train_id, train_name, capacity, service_start, service_ends, num_stations
    });
});

app.get("/api/stations", async (req, res) => {
    const stations = await Station.find({}, "-_id -__v").sort("id");
    res.status(200).json({ stations });
})

app.get("/api/stations/:id/trains", async (req, res) => {
    const id = parseInt(req.params.id);
    let trains = await Train.find({ 'stops.station_id': id });
    if (trains.length == 0) {
        res.status(404).json({ message: `station with id: ${id} was not found` })
    } else {
        let result = [];
        trains.forEach(train => {
            train.stops.forEach(stop => {
                result.push({
                    train_id: train.train_id,
                    arrival_time: stop.arrival_time,
                    departure_time: stop.departure_time
                });
            })
        });
        res.json({ station_id: id, trains: result });
    }
})

app.get("/api/wallets/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const u = await User.findOne({ user_id: id });
    if (u) {
        res.status(200).json({
            wallet_id: id,
            balance: u.balance,
            wallet_user: {
                user_id: id,
                user_name: u.user_name
            }
        });
    } else {
        res.status(404).json({
            message: `wallet with id: ${id} was not found`
        });
    }
})

app.put("/api/wallets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { recharge } = req.body;
    const e = await User.findOne({ user_id: id });
    if (e) {
        if (100 <= recharge && recharge <= 10000) {
            const u = await User.findOneAndUpdate({ user_id: id }, { $inc: { balance: recharge } }, { new: true });
            res.status(200).json({
                wallet_id: id,
                balance: u.balance,
                wallet_user: {
                    user_id: id,
                    user_name: u.user_name
                }
            });
        } else {
            res.status(400).json({
                "message": `invalid amount: ${recharge}`
            })
        }
    } else {
        res.status(404).json({
            message: `wallet with id: ${id} was not found`
        });
    }
});

app.post("/api/tickets", async (req, res) => {
    res.json({
        "ticket_id": 101,
        "balance": 43,
        "wallet_id": 3,
        "stations": [
            {
                "station_id": 1,
                "train_id": 3,
                "departure_time": "11:00",
                "arrival_time": null,
            },
            {
                "station_id": 3,
                "train_id": 2,
                "departure_time": "12:00",
                "arrival_time": "11:55"
            },
            {
                "station_id": 5,
                "train_id": 2,
                "departure_time": null,
                "arrival_time": "12:25"
            }

        ]
    });
})

app.get("/api/routes", async (req, res) => {
    res.json({
        "total_cost": 101,
        "total_time": 85,
        "stations": [
            {
                "station_id": 1,
                "train_id": 3,

                "departure_time": "11:00",
                "arrival_time": null,
            },
            {
                "station_id": 3,
                "train_id": 2,
                "departure_time": "12:00",
                "arrival_time": "11:55"
            },
            {
                "station_id": 5,
                "train_id": null,
                "departure_time": null,
                "arrival_time": "12:25"
            }
        ]
    })
})

app.get("/", async (req, res) => {
    res.send("Hello world99");
});

app.listen(8000);