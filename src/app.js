const express = require("express");
const { userAuth } = require("./middlewares/auth");
const app = express(); // create a new server
const connectDB = require('./config/database');
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


// middleware given by express
app.use(express.json());
app.use(cookieParser());
// app.use(userAuth)


app.post('/signup', async (req, res) => {
    // const userObj = {
    //     firstName: 'Teja',
    //     lastName: 'Darisi',
    //     emailId: "brahmateja.darisi@gmail.com",
    //     password: "king",
    // }

    try {
        validateSignUpData(req);

        // Encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        // create new instance of useModel which needs to be stored in db
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send('user added successfully');
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (user) {
            const isPasswordValid = await user.validatePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid Credentials');
            }
            else {
                const token = await user.getJWT();
                res.cookie("token", token);
                res.send('Login successfull!!!');
            }
        }
        else {
            throw new Error('Invalid Credentials');
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

app.get('/users', async (req, res) => {
    try {
        const userById = await User.find({});

        if (userById.length === 0) {
            throw new Error("No data found")
        }
        res.send(userById);
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})


app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('Authentication Failed');
        }
        res.send(user);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

app.post('/sendConnectionReq', userAuth, async (req, res) => {

    res.send('connection request');
})

app.delete("/user", async (req, res) => {
    const id = req.body.userId;
    try {
        await User.findByIdAndDelete(id)
        res.send("user deleted successfully")
    }
    catch (err) {
        res.status(400).send("soem thing went wrong");
    }

})

app.patch("/user/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        await User.findByIdAndUpdate(id, data)
        res.send("user patched successfully")
    }
    catch (err) {
        res.status(400).send("soem thing went wrong");
    }

})

connectDB().then(() => {
    console.log('database connection is sucessfull');
    app.listen(7777, () => console.log("server up on 7777"));
}).catch((err) => {
    console.log('sorry');
})
