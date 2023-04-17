//Include Express Library
const express = require('express');

//Create Router using express library
const router = express.Router();

//Include DB Config
const db = require('../libs/db_config');

//Include Multer to accept multipart/form-data
const multer = require('multer');

const CategoryModel = require('../models/category');
const ProductController = require('../controller/ProductController') 
const LoggedIn = require('../middleware/isLogged');

// SET STORAGE Upload Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  var upload = multer({ storage: storage })
//Login
router.get('/',function(req, res,next){
res.render('auth/login',{
    page_title:"Login",
    username:"",
    password:"",
})
})

router.post('/',upload.none(),ProductController.signin);

//Logout
router.get('/logout',ProductController.signout);

//Send Mail
router.get('/sendmail/:id',ProductController.sendMail);

//Get All Product List
router.get('/list',LoggedIn.isAuthenticated,ProductController.getAllProducts);

router.get('/add',LoggedIn.isAuthenticated,function(req, res, next){

    module.exports = getAllCategory = CategoryModel.find()
    .then((result) => {
      //console.log(result);
        res.render('createproducts',{
            title:'Add New Products',
            product_name:"",
            category_id:"",
            quantity:"",
            price:"",
            status:"",
            sess:req.session.name,
            data:result,
        });
    })
    .catch((err) =>{
        console.log("error",err);
    });
       
});

// Create Products
router.post('/add',LoggedIn.isAuthenticated,upload.single('myImage'),ProductController.createProducts);

//Edit Products
router.get('/edit/:id',LoggedIn.isAuthenticated,upload.none(),ProductController.editProducts);

//Update Products
router.post('/update',LoggedIn.isAuthenticated,upload.none(),ProductController.updateProducts);

//Delete Products
router.get('/delete/:id',LoggedIn.isAuthenticated,ProductController.deleteProducts);

module.exports = router;   
