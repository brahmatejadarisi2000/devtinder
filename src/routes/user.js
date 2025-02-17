const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');


userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);

        if (users.length === 0) {
            throw new Error("No data found")
        }
        res.send(users);
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})

// get all pending connection requests
userRouter.get('/users/requests/received', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequest.find({
            toUserId: userId,
            status: 'interested'
        }).populate("fromUserId", ["firstName", "lastName", 'age', "about", "gender"]);
        if (!requests) {
            res.send(400).json({ message: 'no Request found' })
        }
        res.send({
            requests
        })
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})

// get all accepted connections
userRouter.get('/users/connections', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: userId,
                    status: 'accepted'
                },
                {
                    fromUserId: userId,
                    status: 'accepted'
                }
            ]
        }).populate("fromUserId", ["firstName", "lastName", 'age', "about", "gender"]).populate("toUserId", ["firstName", "lastName", 'age', "about", "gender"]);

        const data = requests?.map((row) => {
            if (row.fromUserId._id.toString() === userId.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.send({
            data
        })
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})

module.exports = userRouter;