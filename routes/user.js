const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));


router.post('/register', (req, res) => {

    const { name, email, password, password2 } = req.body;

    let errors = [];

    // checking the required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            message: 'please fill all the fields'
        })
    }

    // check password match 

    if (password !== password2) {
        errors.push({
            message: 'password donot match '
        });
    }

    // check password length

    if (password.length < 6) {
        errors.push({
            message: 'password should be at least 6 characters '
        })
    }


    if (errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {

        //after gettin the data we have to done the authenitation ...

        // checking this data already have the account 

        User.findOne({
            email: email
        }).then(user => {
                if (user) {
                    errors.push({
                        message: 'Email is already registered '
                    })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        password2
                    });

                    console.log('newuser:-> data is as follows' + newUser);
                    // now we are saving to the mongo db database ...
                    // before saving to the data base we are encrypt the data ....
                    bcrypt.genSalt(10)
                        .then((salt) => {

                            // encrypting the passpword 
                            bcrypt.hash(newUser.password, salt)
                                .then(encryptedResult => {
                                    newUser.password = encryptedResult
                                        // now this data is to  be savin in the mongodb server

                                    newUser.save()
                                        .then((user) => {
                                            //setting the flash message 
                                            req.flash('success_message', 'you are now registered and can log in ')
                                            res.redirect('/login')
                                        })
                                        .catch(err => { throw err })
                                })
                                .catch(err => { throw err });
                        })
                        .catch(err => { throw err });

                    //res.send('hello your account is to be registered')

                }



            }

        ).catch(

        )










    }

});

/* 

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/users/' + user.username);
      });
    })(req, res, next);
  });

 */
router.post('/login', (req, res, next) => {

    console.log('login is completed now we have to implement the redirect page');
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);

})

// logout handler
router.get('/logout', (req, res) => {
    req.logOut();

    req.flash('success_message', 'you are logged out');
    res.redirect('/user/login');
})

module.exports = router;