const express = require('express');

const router = express.Router();
// login page

const { ensureAuthenticaion } = require('../config/auth');


// welcome page
router.get('/', (req, res) => {
    return res.render('welcome');
})


// Dashboard page
router.get('/dashboard', ensureAuthenticaion, (req, res) => {
    return res.render('dashboard', {
        name: req.user.name
    });
})

module.exports = router;