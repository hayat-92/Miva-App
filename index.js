const express = require('express');
const app = express();
require("dotenv")
  .config();
app.use(express.json())

const routes = require("./routes/v1/");
// const url="mongodb://127.0.0.1:27017/cropdb";
// const url="mongodb+srv://faisal:faisal@class-project.crup7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongoose = require("mongoose");
const passport = require("passport");
const { jwtStrategy } = require("./middleware/passport");

app.use("/v1", routes);

app.use(passport.initialize())
passport.use(jwtStrategy);

const port = process.env.PORT;

mongoose.connect(process.env.URL).then(() => {

  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
});

