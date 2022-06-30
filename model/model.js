const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModelSchema = new Schema({
    name: {type:String},
    profile_img:{type:String},
    cloudinary_id:{type:String},    
});


const History = mongoose.model('History', ModelSchema);

module.exports=History;