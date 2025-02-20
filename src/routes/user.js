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
        res.json({ data: users });
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
        res.json({ data: requests });
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

        res.json({ data });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})


userRouter.get('/users/feed', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 2;
        // sanitize it user may send limit as 100000
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const requests = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: userId,
                },
                {
                    fromUserId: userId,
                }
            ]
        }).select("fromUserId toUserId");

        const hideUsersfromFeed = new Set();

        requests.forEach((req) => {
            hideUsersfromFeed.add(req.fromUserId.toString());
            hideUsersfromFeed.add(req.toUserId.toString());
        })

        const feeds = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUsersfromFeed) } },
            { _id: { $ne: userId } }
            ]
        }).select("firstName lastName age about gender").skip(skip).limit(limit);

        if (feeds.length === 0) {
            throw new Error("No data found")
        }
        res.json({ data: feeds });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
})


module.exports = userRouter;