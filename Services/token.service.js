const jwt = require("jsonwebtoken");

const accessExpirationMinutes = 240;
const ACCESS = "access";
const secret1="thisisasamplesecret";
const generateToken = (userId, expires, type, secret = secret1) => {
    let payload = { sub: userId, type: type, exp: expires };
    let token = jwt.sign(payload, secret);
    return token;

};



const generateAuthTokens = async (user) => {
    const accessTokenExpires = Math.floor(Date.now() / 1000) + accessExpirationMinutes * 60;
    let accessToken = generateToken(user._id, accessTokenExpires, ACCESS);

    dte = (accessExpirationMinutes) * 60;
    let t = new Date(); // Epoch
    t.setSeconds(dte);
    return {
        access: {
            token: accessToken,
            expires: t,
        }
    }

};

module.exports = {
    generateToken,
    generateAuthTokens,
  };