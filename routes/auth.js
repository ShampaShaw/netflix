const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

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

module.exports = router;

