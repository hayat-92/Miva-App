var express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require("../../model/User")
const httpStatus = require("http-status");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");


function fxnRefine(str1) {
    let name = str1;
    var arr = name.split("_");
    let str = arr[0];
    str += " ";
    for (let x = 1; x < arr.length - 1; x++) {
        str += arr[x];
        if (x != arr.length - 2) {
            str += " ";
        }
    }
    if (arr.length > 1) {
        let val = parseInt(arr[arr.length - 1]);
        if (val == NaN) {
            str += " ";
            str += val;
        }
    }

    return str;

}
const cpUpload = upload.fields([{ name: 'left', maxCount: 1 }, { name: 'right', maxCount: 1 }, { name: 'front', maxCount: 1 }])

router.post("/", auth(), cpUpload, async (req, res) => {
    try {

        var files = req.files;
        let instant = {};
        let name = files['left'][0].originalname.split('.');
        let str = fxnRefine(name[0]);
        instant['name'] = str;
        for (const file in files) {
            const { path, fieldname } = files[file][0];

            const result = await cloudinary.uploader.upload(path);
            instant[fieldname] = result.secure_url;
        }

        let userElem = await User.findOne({ email: req.user.email });
        await userElem.history.push(instant);
        userElem.save();

        res.status(200).json({
            data:instant
        })


    } catch (err) {
        res.status(httpStatus.NOT_FOUND).json({ message:"Sorry! person Not Found"});
    }
});
module.exports = router;


async function newcallback(req, res) {
    let userElem = await User.findOne({ email: req.user.email });
    let hist = await userElem.history;
    res.status(httpStatus.FOUND).json({ history: hist });
}


router.get('/', auth(), newcallback);

module.exports = router;
