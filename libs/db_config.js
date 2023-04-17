const mongoose = require('mongoose');

const connect = () => {
    mongoose.set('strictQuery',false);
    mongoose.connect("mongodb+srv://colandev0:feLKkbcZuIuAmeX7@colan-dev.is7xj5p.mongodb.net/Crud_mongodb?retryWrites=true&w=majority",{useNewUrlParser: true},function(err,res){
        if(err){
            throw err;
           console.log("Not Connected",err);
        }
        console.log("Database Connected");
    })
}

module.exports = connect();