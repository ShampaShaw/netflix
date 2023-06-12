const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("connected")) //if connected console.log connected
.catch((err) => console.log(err));//if not connected console.log err

app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
    console.log("Server is running");
})