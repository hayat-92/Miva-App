const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const User = require("../model/User");

const accessExpirationMinutes = 240;
const ACCESS = "access";
const secret1="thisisasamplesecret";


const jwtOptions = {
  secretOrKey: secret1,
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
};


const jwtVerify = async (payload, done) => {

  if(payload.type !== ACCESS){
    return done(Error("Invalid token type"), null);
  }

  User.findById(payload.sub, function(err, user){
    
    if(err){
      return done(err, false);
    }

    if (!user) {
      return done(null, false);
    }

    if(user){
      return done(null, user);
    }
  })
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
