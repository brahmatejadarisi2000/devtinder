const validator = require('validator');


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("emaild is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("plese enter strong password!");

    }
}


const validateEditProfileDate = (req) => {
    const allowedProps = ["firstName", "lastName", "emailId", "gender", "about", "skills"];
    return Object.keys(req.body).every((prop) => allowedProps.includes(prop));
}


module.exports = { validateSignUpData, validateEditProfileDate };