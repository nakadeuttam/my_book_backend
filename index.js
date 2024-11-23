require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const connectToMongo = require('./db')
var cors = require('cors')
connectToMongo();
const authRouter = require('./Routes_express/authrouter')
const corsOptions = {
  origin: 'https://my-book-by-ugn.netlify.app', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization' , 'auth-token'], // Allow these headers
};
app.use(cors(corsOptions))
app.use('/auth' , authRouter)
app.use(express.json())       //it is require to write so that to read req.body otherwise you cant work with request bosy
app.use('/sign_up', require('./Routes_express/create_user'))
app.use('/notes' , require('./Routes_express/notes'))
app.listen(port, () => {
  console.log(`my_Notebook Backend listening on port ${port}`)
})