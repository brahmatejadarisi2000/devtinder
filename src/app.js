const express = require("express");
const { userAuth } = require("./middlewares/auth");
const app = express(); // create a new server
const connectDB = require('./config/database');
const User = require('./models/user')
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');


// middleware given by express
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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
