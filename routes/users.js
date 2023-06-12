const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js"); //to update our password
const verify = require("../verifyToken")

//UPDATE
router.put("/:id", verify, async(req,res) => {
    if( req.user?.id === req.params.id || req.user.isAdmin){  //update the user
        if(req.body.password) {
            req.body.password =  CryptoJS.AES.encrypt(      //new password
                req.body.password, 
                process.env.SECRET_KEY
                ).toString()                      //encrypt the new password
        }

        try {                                               //here u can update the user
            const updateUser = await User.findByIdAndUpdate(
                req.params.id, 
                {
                    $set: req.body
                },
                { new: true }
                )
            res.status(200).json(updateUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your account");   //not updated
    }
})

//DELETE
//GET(GET ONE USER)
//GET ALL(GET ALL USER)
//GET USER STATS (NO. OF USER PER MONTH)

module.exports = router