const express = require("express");
const authRouter = express.Router();
const User = require('../models/user')
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        // Encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new instance of useModel which needs to be stored in db
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.json({ message: 'User added successfully' });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

authRouter.post('/login', async (req, res) => {
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
                res.json({ message: 'Login Successfull' });
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


authRouter.post('/forgetPassword', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (user) {
            const passwordHash = await bcrypt.hash(password, 10);
            user.password = passwordHash;
            await user.save();
            res.json({ message: 'Password Updated Successfully' });
        }

        else {
            throw new Error('User Not Found');
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.json({ message: 'Logout Successfull' });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = authRouter;