const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate date before add
    const { error } = registerValidation(req.body);
    if (error) return res.send(error.details[0].message);
    

    // Check if the user is already created
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.send('Email already exist.....');

    //Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });

    } catch (err) {
        res.status(400).send(err);
    }

});

router.post('/login', async (req, res) => {

    // Validate date before add
    const { error } = loginValidation(req.body);
    if (error) return res.send(error.details[0].message);
    

    // Check if the email is already created
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.send('Email is wrong');

    // Check if password is correct 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if( !validPassword ) return res.status(400).send('Invalid Password');

    // Create and assign TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
});


module.exports = router;