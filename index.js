const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const movieRoutes = require("./routes/movies");
const listRoutes = require("./routes/lists");


dotenv.config();
<<<<<<< HEAD
app.use(cors());
=======
app.use(cors(

));
>>>>>>> 48d55a5b079a2a5ccc7d351e9c6d8266d4ff9292

const PORT = process.env.PORT ;

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log(`Connected to MongoDB successfully! 🎉 ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

connectToDatabase();

app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/lists", listRoutes);

app.get("/", (req, res) => {   
    res.send("Welcome to Netflix API");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})