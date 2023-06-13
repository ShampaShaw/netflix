const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken")

//CREATE
router.post("/", verify, async(req,res) => {
    if( req.user.isAdmin){  //post movie only if u are a admin
        const newMovie = new Movie(req.body);

        try {      //try to collect the data in database
            const savedMovie = await newMovie.save();  //save the movie
            res.status(201).json(savedMovie);
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
            await Movie.findByIdAndDelete(req.params.id)          //update the movie by id and set new data insid  
            res.status(200).json("movie has been deleted");
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed");   //not updated
    }
})


//GET
router.get("/:id", verify, async(req,res) => {  //get movie by id(/:id)
        try {      
            const movie = await Movie.findById(req.params.id)          //if you are not an admin then u can still watch the movies
            res.status(200).json(movie);
        } catch(err) {
            res.status(500).json(err);
        }
})


module.exports = router