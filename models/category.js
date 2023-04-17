const mongoose  = require("mongoose");

//Require DB


//db
const db = require('../libs/db_config');

var CategorySchema = new mongoose.Schema({

    category_name :String,
    description:String,
});


//RegisterModel
var Category = mongoose.model('category',CategorySchema);

module.exports = Category;
