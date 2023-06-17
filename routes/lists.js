const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken")

//CREATE
router.post("/", verify, async(req,res) => {
    if( req.user.isAdmin){  //create list
        const newList = new Movie(req.body);

        try {      //try to collect the data in database
            const savedList = await newList.save();  //save the list
            res.status(201).json(savedList);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");   
    }
})

//DELETE

//GET LIST


module.exports = router