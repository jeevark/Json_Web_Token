var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const sqlconn = require('./dbms');

const ACCESS_TOKEN ="dvfokaiwfvidyfkgwvola";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter); 

// JWT Method.........................................................

const authenticateToken = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if(!token){
    return res.Status(403).send(err);
  }
  jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
    if(err){
      res.Status(403).send("verify Error.........")
    }
    req.user =user; 
    next();
  })
}  


app.post('/signup',(req,res)=>{
  try {
   // var token =  jwt.sign(person,ACCESS_TOKEN);
    const person = {
      useremail : req.body.useremail,
      password  : req.body.password,
      token     : ' '
    }
    person. token =  jwt.sign(person.useremail,process.env.ACCESS_TOKEN);
    console.log(person);
    sqlconn.query('insert into token set ?',person,(err,result)=>{
      if(err){
        res.status(404).send("MySql Error.........");
      }
      else
        {
          res.status(200).json({
            'Result' :'Success...',
            'token' : person.token
          });
        }   
      })
  } catch (err){
    res.status(400).send("Error...");
  }  
})

app.get('/posts',authenticateToken,(req,res)=>{

   console.log(req.user);
  res.json({"result": 'Success.......'})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
