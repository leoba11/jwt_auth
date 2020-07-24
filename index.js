//imports
const express = require('express');
const app = express();

//import Routes
const authRouter = require('./routes/auth');

//Middleware
app.use('/api/user', authRouter);

app.listen(3000, () => { console.log('Server up and running') });