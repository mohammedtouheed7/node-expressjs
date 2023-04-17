module.exports = {
    isAuthenticated:(req, res, next) => {
        if(!req.session.name){
            req.flash('error','Your Session Expired. Please Login');
            res.redirect('/products/');
            return;
        }
        next();
    }
}