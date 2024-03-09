const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken")

//CREATE
router.post("/", verify, async(req,res) => {
    if( req.user.isAdmin){  //post movie only if u are a admin
        const newMovie = new Movie(req.body);

        try {      //try to collect the data in database
            const savedMovie = await newMovie.save();  //save the movie
            res.status(200).json(savedMovie);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");   //not updated
    }
})

//UPDATE
router.put("/:id", verify, async(req,res) => {//update movie by id
    if( req.user.isAdmin){  

        try {      
            const updatedMovie = new Movie.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{ new: true});
            res.status(200).json(updatedMovie);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");   //not updated
    }
})

//DELETE
router.delete("/:id", verify, async(req,res) => {  //get movie by id(/:id)
    if( req.user.isAdmin){  
        try {      
            await Movie.findByIdAndDelete(req.params.id)          //update the movie by id and set new data inside
            res.status(200).json("movie has been deleted");
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");   //not updated
    }
})


//GET
router.get("/find/:id", verify, async(req,res) => {  //get movie by id(/:id)
    if( req.user){      
    try {      
            const movie = await Movie.findById(req.params.id)          //if you are not an admin then u can still watch the movies
            res.status(200).json(movie);
            return movie;
        } catch(err) {
           res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You are not allowed");
    }
})

//GET RANDOM
router.get("/random", verify, async(req,res) => {  //get random movie or series by using type by id(/:id)
    const type = req.query.type;
    let movie
    try {      
        if( type === "series") {
            movie = await Movie.aggregate([
                { $match : { isSeries /*from Movie.js */: true}},  //give all series
                { $sample: { size:10 }}   //give only one sample series
            ])
        } else {
            movie = await Movie.aggregate([
                { $match : { isSeries /*from Movie.js */: false}},  //give all movies
                { $sample: { size:10 }}   //give only one sample movies
            ])
        }
        res.status(200).json(movie);
    } catch(err) {
        res.status(500).json(err);
    }
})

//GET ALL
router.get("/", verify, async(req,res) => {  //get all movies u are an admin
    if( req.user.isAdmin){  
        try {      
            const movies = await Movie.find()          
            res.status(200).json(movies.reverse()); //reverse the array and send the last array
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");
    }
})


module.exports = router