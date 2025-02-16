const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        if (!req.user) {
            throw new Error('Authentication Failed');
        }
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status
        const allowedStatus = ['interested', 'ignored']

        if (fromUserId === toUserId) res.status(400).json({ message: `Invalid Connection Request` });

        if (!allowedStatus.includes(status)) res.status(400).json({ message: `Invalid Status Type ${status}` });

        const isToUserIDExists = await User.findById(toUserId);
        if (!isToUserIDExists) {
            res.status(404).json({ message: `User Not Found` });
        }

        //if there is existing connection requests
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        })


        if (existingConnectionRequest) {
            res.status(400).json({
                message: 'Connection Request Already Exists',
                existingConnectionRequest
            })
        }
        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await request.save();
        res.json({
            message: 'Connection Request Sent Successfully',
            data
        })
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = requestRouter;