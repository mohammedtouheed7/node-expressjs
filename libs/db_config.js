const mongoose = require('mongoose');

const connect = () => {
    mongoose.set('strictQuery',false);
    mongoose.connect("mongodb://localhost:27017/Crud_mongodb",{useNewUrlParser: true},function(err,res){
        if(err){
            throw err;
           console.log("Not Connected",err);
        }
        console.log("Database Connected");
    })
}

module.exports = connect();