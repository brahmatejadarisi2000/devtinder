const express = require("express");
const app = express(); // create a new server
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');


// middleware given by express
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


connectDB().then(() => {
    console.log('database connection is sucessfull');
    app.listen(7777, () => console.log("server up on 7777"));
}).catch((_) => {
    console.log('sorry');
})
