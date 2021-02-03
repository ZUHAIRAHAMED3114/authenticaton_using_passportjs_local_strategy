// dependencies
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// local dependencies
const User = require('../models/User');

module.exports = function(passport) {

    // this below method is defining to use the local strategy 
    passport.use(new LocalStrategy({ usernameField: 'email' },
        (email, password, done) => {
            // checking the particular user in the data base is available or not
            User.findOne({ email: email })
                .then(result => {
                    // now result is nothing but the use data 
                    // is result is null i.e means particulare user is not there in the 
                    // data base 

                    if (!result) {
                        done(null, false, {
                            message: `pariculare user with the ${email}is not present 
                                            so pleare regigeter`
                        })
                    }
                    // if result is present i.e means 
                    // particulr user with the current email is there
                    // now we are comparing the password

                    bcrypt.compare(password, result.password)
                        .then((newresult) => {
                            // here result is boolean type wheater 
                            // both above data is matched or not
                            if (!newresult) {
                                done(null, false, {
                                    message: 'password incorrect'
                                })
                            } else {
                                // here the both password  are matched 
                                //...   
                                done(null, result);
                            }


                        }).catch((err) => {
                            throw err;
                        });


                })
                .catch(err => {
                    // this error is raised during the connection
                    // e
                    console.log(err)
                })
        }))

    // this methods are to be used for serializing and deserializing the data
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


}