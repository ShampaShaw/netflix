const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("connected")) //if connected console.log connected
.catch((err) => console.log(err)); //if not connected console.log err

app.listen(5000, () => {
    console.log("Server is running");
})