var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');

//jos autentikointi tehdään tietokannasta tarvitaan seuraavat 2 riviä
const db = require('./database');
const bcrypt = require('bcryptjs');
//autentikointi 

var bookRouter = require('./routes/book');
var studentRouter = require('./routes/student');

var app = express();


app.use(basicAuth( { authorizer: myAuthorizer, authorizeAsync:true, } ))

dotenv.config();

function myAuthorizer(username, password,cb){
    db.query('SELECT password FROM user_table WHERE username = ?',[username], 
      function(dbError, dbResults, fields) {
        if(dbError){
              response.json(dbError);
            }
        else {
          if (dbResults.length > 0) {
            bcrypt.compare(password,dbResults[0].password, 
              function(err,res) {
                if(res) {
                  console.log("succes");
                  return cb(null, true);
                }
                else {
                  console.log("wrong password");
                  return cb(null, false);
                }			
                response.end();
              }
            );
          }
          else{
            console.log("user does not exists");
            return cb(null, false);
          }
        }
      }
    );
  }
/*
function myAuthorizer(username, password, cb){
    if(username===process.env.authUser && password ===process.env.authPassword){
        return cb(null, true);
    }
    else{
        return cb(null, false);
    }
}*/


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/book', bookRouter);
app.use('/student', studentRouter);

module.exports = app;
