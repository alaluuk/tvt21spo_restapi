var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');

var bookRouter = require('./routes/book');
var studentRouter = require('./routes/student');

var app = express();


app.use(basicAuth( { authorizer: myAuthorizer, authorizeAsync:true, } ))

dotenv.config();

function myAuthorizer(username, password, cb){
    if(username===process.env.authUser && password ===process.env.authPassword){
        return cb(null, true);
    }
    else{
        return cb(null, false);
    }
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/book', bookRouter);
app.use('/student', studentRouter);

module.exports = app;
