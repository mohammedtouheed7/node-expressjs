const moongose = require('mongoose');

//db
const db = require('../libs/db_config');

//Model
const CategoryModel = require('../models/category'); 

//Create Category

const CreateCategory = new CategoryModel({
    category_name :"Airpods",
    description:"This Product Category belongs to Airpods",
})

CreateCategory.save()
.then((res) => {
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})

module.exports = CreateCategory;


