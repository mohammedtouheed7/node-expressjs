const moongose = require('mongoose');

//Crypt Pass using bcryptjs Library
const bcrypt = require('bcryptjs');

//jwt library
const jwt = require('jsonwebtoken');

const path = require('path');
const fs = require("fs");

//Node Mailer
const nodemailer = require('nodemailer');

//Handlebars is used html template
const handlebars = require('handlebars');
//db
const db = require('../libs/db_config');
const Category = require('../models/category');

//Model
const ProductModel = require('../models/products');

const Login = require('../models/login');


//CatID = 63be9a437b22735fb041fb3

//Login
exports.signin = (req, res) => {

    //validate 
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        Login.find({ email: req.body.username }, function (err, result) {
            if (err) {
                req.flash('error', 'User not registered!');
                res.redirect('/products/');
            } else {
                if (result.length > 0) {
                    var hash = result[0].password;
                        bcrypt.compare(req.body.password, hash, function(err, results) {
                            if (err) { 
                                req.flash('error', err)
                                res.redirect('/products/');
                            }
                            if(results){
                                ses_name = req.session;
                                ses_name.loggedin = true;            //$_SESSION['loggedin'] in PHP
                                ses_name.name = result[0].name;      //$_SESSION['name'] in PHP
                                res.redirect('/products/list');
                            }else{
                                req.flash('error', 'Password Not Match')
                                res.redirect('/products/');
                            }
                            
                        });
                } else {
                    req.flash('error', 'Please Enter Correct Username / Password')
                    res.redirect('/products/')
                }

            }
        })
    } else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + "<br>";
        })
        req.flash('error', error_msg);
        res.redirect('/products/')
    }
}


exports.signout = (req, res) => {
    delete req.session.name;
    req.flash('success', "User Logged Out");
    res.redirect('/products/');
}

//Create Products
exports.createProducts = (req, res) => {

    //Validate
    req.assert('product_name', 'Product name is required').notEmpty();
    req.assert('category_id', 'Please Select Category').notEmpty();

    //validation errors
    var errors = req.validationErrors();
    if (!errors) {
        //Create 
        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = {
            contentType: req.file.mimetype,
            name: req.file.path,
            // image:Buffer(encode_img,'base64')
        };
        const CreateProduct = new ProductModel({
            product_name: req.body.product_name,
            category_id: req.body.category_id,
            quantity: req.body.quantity,
            price: req.body.price,
            status: req.body.status,
            img: final_img,

        })

        CreateProduct.save((err, result) => {
            if (!err) {
                req.flash('success', 'Product Added Successfully');
                res.redirect('/products/list');
            }
        })
    } else {
        var error_message = '';
        errors.forEach(function (error) {
            error_message += error.msg + "<br/>";
        })
        req.flash('error', error_message);
        res.redirect('/products/add');
    }


}

exports.sendMail = (req, res) => {

    //ID
    const row_id = req.params.id;

    ProductModel.findById(row_id, function (err, result) {
        if (err) {

        }
        var data = {
            product_name: result.product_name,
            category_id: result.category_id.toString(),
            price: result.price,
            quantity: result.quantity,
            status: result.status,
        };
        const dirname = path.resolve();
        const filepath = path.join(dirname, "./views/emailTemplate.html");
        const source = fs.readFileSync(filepath, 'utf-8').toString();
        var template = handlebars.compile(source);
        var htmlToSend = template(data)
        //data also sent
        //var data = {name: "Mohammed Touheed", email:"mohammedtouheed@gmail.com"};

        //console.log("T4wset",htmlToSend);
        // return;

        //Create Transport
        let mailTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mohammedtouheed77@gmail.com',
                pass: "grczdgaedllqmwfs",
            }
        })
        let maildetails = {
            from: 'mohammedtouheed77@gmail.com',
            to: 'mohammedtouheed75@gmail.com',
            subject: "Test Mail From NodeJS",
            html: htmlToSend,
            // text:'This is Test Mail From NodeJS'
        };

        mailTransport.sendMail(maildetails, function (err, result) {
            if (result) {
                req.flash('success', 'Email Sent Successfully');
                res.redirect('/products/list');
            } else {
                console.log("Mail Sent Failed", err)
            }

        })
    });






}
//Get All Products
exports.getAllProducts = (req, res) => {
    module.exports = getAllProduct = ProductModel.find().populate('category_id')
        .then((result) => {
            //console.log(result);
            res.render('index', {
                page_title: 'List Products',
                data: result,
                sess: req.session.name
            });
        }).catch((error) => {
            console.log('Data Load Failed', error)
        })
}

//Edit Products

exports.editProducts = (req, res) => {
    const edit_id = req.params.id;
    //console.log(edit_id);
    ProductModel.findById(edit_id, function (err, result) {
        if (!err) {
            Category.find(function (err, result1) {
                //console.log(result.category_id.toString());
                res.render('editproducts', {
                    page_title: "Edit Products",
                    id: result._id,
                    product_name: result.product_name,
                    category_id: result.category_id.toString(),
                    price: result.price,
                    quantity: result.quantity,
                    status: result.status,
                    data: result1,
                    sess: req.session.name,
                })
            })

        }
    })
}

//Update products

exports.updateProducts = (req, res) => {
    //product id
    var p_id = req.body.product_id;
    //console.log("product_id",p_id);
    var products_update = {
        product_name: req.body.product_name,
        category_id: req.body.category_id,
        quantity: req.body.quantity,
        price: req.body.price,
        status: req.body.status,
    }

    // console.log("data",products_update);

    //Update
    ProductModel.findByIdAndUpdate(p_id, products_update, function (err, result) {
        if (!err) {
            console.log(result);
            //Add New Field
            req.flash('success', 'Product Successfully updated!');
            res.redirect('/products/list');
        } else {
            req.flash('error', 'Product Update Failed!');
            res.redirect('/products/list');
            // console.log('Error',err);
        }
    })
}


//Delete Products
exports.deleteProducts = (req, res) => {
    var product_id = req.params.id;

    ProductModel.findByIdAndRemove(product_id, function (err, result) {
        if (!err) {
            let dir_name = path.resolve();
            let upload_dir = path.join(dir_name,"/");
            let filename = upload_dir +result.img.name;
            //console.log("filename",filename);
            if(fs.existsSync(filename)){
                fs.unlink(filename,function(err){
                    if(err){
                        console.log("Error",err);
                    }else{
                        console.log("Image Removed Successfully");

                    }
                })
            }else{
                
                console.log('false');
            }
            

            
            req.flash('success', 'Product Deleted!');
            res.redirect('/products/list');
        } else {
            req.flash('error', 'Product Delete Failed!');
            res.redirect('/products/list');
        }
    })

}