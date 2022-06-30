const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route")
const modelRoute = require("./model.route")


router.use("/auth", authRoute);
router.use("/model", modelRoute);

module.exports = router;