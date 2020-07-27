//imports
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import Routes
const authRouter = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => { 
        console.log('Connected to DB..... YEIIII') 
    });

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRouter);
app.use('/api/posts', postRoute);

app.listen(3000, () => { console.log('Server up and running') });