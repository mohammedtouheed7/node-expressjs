const mongoose  = require("mongoose");

//CreateSchema
var ProductSchema = new mongoose.Schema({
    product_name:String,
    category_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'category'
    },
    quantity:Number,
    price:Number,
    status:Number,
    img:
    {
        data: Buffer,
        name:String,
        contentType: String
    },
});

//RegisterModel

var Product  =  mongoose.model('products',ProductSchema);


//Update New Field in Existing Schema
// Product.updateOne({}, 
//     {$set : 
//         {
//         phone2:String
//         }
//     },function(error, result){
//         if(error){
//             console.log('error',error)
//         }else{
//             console.log('Schema Result',result)
//         }
//     })
    

module.exports = Product;

