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

router.delete("/:id", verify, async(req,res) => {
    if( req.user?.id === req.params.id || req.user.isAdmin){  
        try {                                               
           await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted....!");
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can delete your account");   //if we are not the admin or owner then send this error
    }
})

//GET(GET ONE USER)

router.get("/find/:id", async(req,res) => {
   //anyone can reach the information of user so we don't need to verify the token
        try {                                               
           const user = await User.findById(req.params.id)
           const { password, ...info } = user._doc
            res.status(200).json(info);
        } catch (err) {
            res.status(500).json(err);
        }
})
//GET ALL(GET ALL USER)

router.get("/", verify, async(req,res) => {
    const query = req.query.new;
    if(req.user.isAdmin){  
        try {                                               
           const users = query ? await User.find().limit(10) /*find only last 10 user*/ : await User.find() //get all users
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to get all users");  
    }
})
//GET USER STATS (NO. OF USER PER MONTH)

module.exports = router