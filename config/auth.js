module.exports = {
    ensureAuthenticaion: function(req, res, next) {
        // isAuthenticated() is to be added to the request object
        // by the passport.js file 

        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_message', 'please login to view this resource');
        res.redirect('/user/login');
    }
}