const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians 
app.get('/musicians', async (req,res) =>{
    const getAll = await Musician.findAll();
    res.json(getAll);
})

//get musician by id
app.get('/musicians/:id', async (req,res,next) =>{
    try{
        let getById=await Musician.findByPk(req.params.id);
        if(!getById){
            throw new Error('Musician not found');
        }
        res.json(getById);
    }catch(error){
        next(error);
    }
});
// Middleware to parse JSON objects in the request body
app.use(express.json());

// Middleware to parse URL-encoded values in the request body
app.use(express.urlencoded({ extended: true}));


app.post('/musicians', async (req,res, next) =>{
    try {
        const { name, instrument } = req.body;
        const musician = await Musician.create({ name, instrument });
        res.json(musician);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create musician' });
      }
});

app.put('/musicians/:id', async (req,res, next) =>{
    //update an existing record using PUT method and send back updated data
    console.log("Update");
    try{
        const {id} = req.params;
        const {name, instrument} = req.body;
        const musician = await Musician.findByPk(id);
        if(musician){
            musician.name = name;
            musician.instrument = instrument;
            await musician.save();
            res.json(musician);
        } else{
            throw new Error('Musician not found');
        }
    } catch(error){
        next(error);
    }
});

app.delete('/musicians/:id', async (req, res, next) =>{
    // delete a specific resource by id
    try{
        const {id}= req.params;
        const musician = await Musician.findByPk(id);
        if(musician){
            await musician.destroy();
            res.json({message: 'Musician deleted'});
        } else{
            throw new Error('Musician not found')
        }
    }catch(error){
        next(error);
    }
});








module.exports = app;