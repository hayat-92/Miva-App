const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");

const tokenService = require('../../Services/token.service');

const User = require("../../model/User");

const createUser = async (user) => {
    console.log(user)
    let obj = {};
    obj.flag = true;
    if (!user.password) {
        // throw new Error('Password Required!');
        obj.message = "Password Required!";
        obj.flag = false;
    }
    let check = await User.isEmailTaken(user.email);
    if (check) {
        // throw new Error("Email already taken!")
        obj.message = "Email already taken!";
        obj.flag = false;
    } else {
        let doc = await User.create(user);
        obj.doc = doc;
        // return doc;
    }
    return obj;
}

const register = async (req, res) => {
    let usr = await createUser(req.body);
    let token = await tokenService.generateAuthTokens(usr);
    if (!usr.flag) {
        res.status(httpStatus.BAD_REQUEST).json({ message: usr.message });
    } else {
        res.status(httpStatus.CREATED).send({
            user: usr.doc,
            tokens: token
        })
    }


};

const getUserByEmail = async (email) => {
    let usr = await User.findOne({ email: email });
    return usr;
}



const loginUserWithEmailAndPassword = async (email, password) => {

    if (!email || !password) {
        throw new Error("Incorrect email or password")
    }
    let user = await getUserByEmail(email);


    if (!user) {
        throw new Error("Incorrect email or password")
    }

    const if_password = await user.isPasswordMatch(password)
    if (!if_password) {
        throw new Error("Incorrect email or password")
    }

    return user;

};

const login = async (req, res) => {
    try {
        let user = await loginUserWithEmailAndPassword(req.body.email, req.body.password);
        let user_token = await tokenService.generateAuthTokens(user);
        res.status(httpStatus.OK).send({ user: user, tokens: user_token })
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error.message);
    }



};

//Register
router.post('/register', register);

//Login
router.post('/login', login);


module.exports = router;