const mongoose  = require("mongoose");

//db
const db = require('../libs/db_config');

var LoginSchema = new mongoose.Schema({
    name:String,
    username :String,
    password:String,
});


//RegisterModel
var Login = mongoose.model('logintables',LoginSchema);

module.exports = Login;