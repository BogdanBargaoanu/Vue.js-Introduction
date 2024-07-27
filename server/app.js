var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('mssql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Swagger setup

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cashflow API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);


// SQL Server setup
const config = {
  /*user: 'your_username', // replace with your username
  password: 'your_password', // replace with your password
  server: 'localhost', // use 'localhost\\SQLEXPRESS' if you have a named instance
  database: 'your_database', // replace with your database name*/
  server: 'localhost\\MSSQLLocalDB',
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    trustedConnection: true // Use Windows Authentication
  }
};

sql.connect(config).then(pool => {
  if (pool.connected) {
    console.log('Connected to SQL Server');
  }
}).catch(err => {
  console.error('Database connection failed: ', err);
});

app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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
