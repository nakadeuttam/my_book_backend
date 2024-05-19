require('dotenv').config();
const connectToMongo = require('./db')
var cors = require('cors')
connectToMongo();

const express = require('express')
const app = express()
app.use(cors())
const port = process.env.PORT || 5000
app.use(express.json())       //it is require to write so that to read req.body otherwise you cant work with request bosy
app.use('/sign_up', require('./Routes_express/create_user'))
app.use('/notes' , require('./Routes_express/notes'))
app.listen(port, () => {
  console.log(`my_Notebook Backend listening on port ${port}`)
})