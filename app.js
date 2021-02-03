//dependencies
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

// passport configure...
const passport = require('passport');
require('./config/passport')(passport);


const index = require('./routes/index');
const userroute = require('./routes/user');

//retrieving config data
const keys = require('./config/key').MongoUri;

// connection to the mongo db database 
mongoose.connect(keys, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('connected to the MONGO DB database server ')
    } else {
        console.log(err);
    }
})




//application
const app = express();

//middlewares
//-- body parser middleware
app.use(express.urlencoded({
    extended: false
}));
//-- layouts middleware
app.use(expressLayout);
//-- session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//-- passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// -- connection to the flash 
app.use(flash());

// 

// global varialbles are to added through this middleware
// this variable are to be used in any template view page like partial,layout etc..,
app.use((req, res, next) => {
    // gettin the value from the flash 
    // note success_message and error_messge for both key their values are  
    // set their value during register page i.e is post register route 
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');

    // where as  flash for error is assigned // this is set by the 
    // passoprt js module :-> beacause we say i.e during the loginopotion i.e 
    // failure flash is true.... 

    res.locals.error = req.flash('error')
    next();
})

// to the above code defining i.e we are acessing the 
// req.flash('key'):-> message value :-> 
//note who will set this value to the flash 



//routes
app.use('/', index);
app.use('/user', userroute);


//setting
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const PORT = process.env.port || 5000;
app.listen(PORT, () => {

    console.log('server start listening in the port no ===>' + PORT)
});