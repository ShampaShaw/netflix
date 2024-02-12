const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken")

//CREATE
router.post("/", verify, async(req,res) => {
    if( req.user.isAdmin){  //create list
        const newList = new List(req.body);

        try {      //try to collect the data in database
            const savedList = await newList.save();  //save the list
            res.status(201).json(savedList);
        } catch(err) {
            console.log(err)
        }
    } else {
        res.status(404).json("You are not allowed");   
    }
})

//DELETE

router.delete("/:id", verify, async(req,res) => {
    if( req.user.isAdmin){  

        try {      
            await List.findByIdAndDelete(req.params.id);  //delete the list 
            res.status(201).json("The list has been deleted");
        } catch(err) {
            res.status(500).json(err)
        }
    } else {
        res.status(404).json("You are not allowed");   
    }
})

//GET LIST

router.get("/", verify, async(req,res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try{
        if(typeQuery){    //if there is series or movies
            if(genreQuery){
                list = await List.aggregate([
                    { $sample: {size: 10} }, //return item of 10
                    { $match: { type: typeQuery, genre: genreQuery } } , // match the type of query and genre then send to the 10 general sample
                ])
            }
            else { // if no genre
                list = await List.aggregate([
                    { $sample: { size:10}}   ,
                    { $match: { type: typeQuery}} ,
                    
                ])
            }
        } 
        else {  //else return random lists
            list = await List.aggregate([{ $sample: {size: 10}}]) //return sample list of 10 items

        }

        res.status(200).json(list);

    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router