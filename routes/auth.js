const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTRATION

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User with this email already exists");
        }

        // Encrypt the password
        const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            process.env.SECRET_KEY
        ).toString();

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: encryptedPassword,
        });

        // Save the new user
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        console.error("Error occurred during registration:", err); // Log the error for debugging purposes
        res.status(500).json("Internal Server Error");
    }
});


//login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json("Wrong Email!");
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong password or username!");
        }

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
        );

        const { password, ...info } = user._doc;

        return res.status(200).json({ ...info, accessToken });
    } catch (err) {
        console.error("Error occurred during login:", err); // Log the error for debugging purposes
        return res.status(500).json("Internal Server Error");
    }
});


module.exports = router;

