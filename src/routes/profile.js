const express = require("express");
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileDate } = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error('Authentication Failed');
        }
        res.json({ data: user });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileDate(req)) {
            throw new Error("Edit Not Allowed");
        }
        const user = req.user;
        if (!user) {
            throw new Error('Authentication Failed');
        }
        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
        await user.save();
        res.json({
            message: 'Edit Sucessfull',
            user
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;
