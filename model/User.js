const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
// const History =require('./model')
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  password: {
    type: String,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          "Password must contain at least one letter and one number"
        );
      }
    },
  },
  history: [{
    name: { type: String },
    left: { type: String },
    right: { type: String },
    front: { type: String }
  }],
});


userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.statics.isEmailTaken = async function (email) {
  if (await this.findOne({ 'email': email })) {
    return true;
  } else {
    return false;
  }

};

userSchema.methods.isPasswordMatch = async function (password) {
  let is_match = await bcrypt.compare(password, this.password);
  console.log(`Faisal=${is_match}`)
  return is_match;

};


const User = mongoose.model('User', userSchema);

module.exports = User;