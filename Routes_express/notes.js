const express=require('express');
const fetchUserData = require('../middleware/fetchUser');
const router =express.Router();
const Notes = require('../models_mongo/Notes');
const { body, validationResult } = require('express-validator');

//post endpoint to read notes
router.get('/Your_notes',fetchUserData , async(req, res)=>{
    const notes=await Notes.find({user:req.user.id});
    res.json(notes);
});

//End_point to create Notes
router.post('/createNote',fetchUserData ,[      //validation part
    body('title',"Please enter valid title").exists(),
    body('description',"Please enter valid description").isLength({min:5})
] ,
async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {title,description} = req.body;
        const note= new Notes({title,description,user:req.user.id});
        const saved_Note=await note.save();
        res.json(saved_Note);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went Wrong")
    }
});


//Endpoint for Updating the existing notes 

router.put('/updateNote/:id',fetchUserData,async (req,res)=>{
    const{title,description}=req.body;
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};

    let existing_note=await Notes.findById(req.params.id);  //req.params.id is the id of note in Notes table
    
    if(!existing_note){return res.status(404).send('Not Found')};
    //check whether user is authorized
    if(existing_note.user.toString()!== req.user.id)
    {
        return res.status(404).send("Dont have access")
    }
    //Lets update the note
    existing_note=await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
    res.json({existing_note});

});


//Endpoint to delete the note
router.delete('/deleteNote/:id',fetchUserData,async (req,res)=>{
    try{
    let existing_note=await Notes.findById(req.params.id);
    if(!existing_note)
    {
        return res.status(404).send("Data Not Found")
    }
    const titleOfNote=existing_note.title;
    if(existing_note.user.toString()!=req.user.id)
    {
        return res.status(404).send("Dont have access")
    }
    await Notes.findByIdAndDelete(req.params.id);
    res.send(`The Note with title ${titleOfNote} is deleted Successfully`)
}catch(error){console.error(error.message)
    res.status(500).send("Internal Server Error")
    };
})
module.exports = router;