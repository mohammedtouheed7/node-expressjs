const express = require('express');
const app = express();

const path = require('path');

//Include Express Flash Library to show the error and success message
const flash = require('express-flash');

//Include Express Session Library used for stored value in session like php
const session = require('express-session');

//Form Validator
const expressValidator = require('express-validator')

app.use(express.urlencoded({ extended: true })); // to get the form-data
app.use(express.json()); // form-data convert to json
// app.use(cookieParser());
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));
//Session
app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 } // 5 Minutes
}))

//Session Message
app.use(flash());
app.use(expressValidator());

//Create Category
//const CategoryController = require('./controller/CategoryController'); 

//Routes
const productsRoutes = require('./routes/routers')

app.use('/products',productsRoutes);


//setup view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')


app.get('/',function(req,res){
    res.render('index',{page_title:"Home - Node.jss",data:''});
    //res.send("Welcome")
});

//Create Server
var server = app.listen(8088,function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is Running at http://127.0.0.1:8088/',host,port);

});

module.exports = app;