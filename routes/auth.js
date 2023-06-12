const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTRATION

router.post("/register", async (req,res) => {      //use post for creating something
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password, 
                process.env.SECRET_KEY
                ).toString(),
        })

        try {
            const user = await newUser.save() //here save the user who is registered
            res.status(201).json(user)
        }catch(err) {
          res.status(500).json(err) // if not save then show error
        }

}) 

//login

router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); //find the person by email which is registered
        !user && res.status(401).json("Wrong password or Username!")

        const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY); //checking the password by bcrypt it
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && 
            res.status(401).json("Wrong password or username!") // if registeredpassword not equal to originalPassword then send 401

            const accessToken = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin}, //get the user_id and admin
                process.env.SECRET_KEY,
                {expiresIn: "5d"} //sign in get expires in 5d
            );    

            const { password, ...info } = user._doc; //its not show password only give information

            res.status(200).json({ ...info, accessToken });

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;

