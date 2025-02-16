const mongoose = require('mongoose');
// use validator package for string sanitizations
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('please enter valid emailid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(val) {
            if (val.length < 10) {
                throw new Error('please enter password of length > 9')
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: 'this is default about user'
    },
    skills: {
        type: [String]
    }
},
    {
        timestamps: true,
    }
)

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id, }, "teja2000", {
        expiresIn: "7d"
    })
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);