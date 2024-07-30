var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// MySQL setup
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'c4shfl0w4pp',
  database: 'cashflowapp'
});

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Connected to database');
    const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
      idUsers INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
      password VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
      PRIMARY KEY (idUsers)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;
    const createEntitiesTableQuery = `CREATE TABLE IF NOT EXISTS entities (
      idEntities INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NULL,
      isUser TINYINT(1) NULL,
      PRIMARY KEY (idEntities))`;
    const createCashflowLogTableQuery = `CREATE TABLE IF NOT EXISTS cashflowLog (
      idcashflowLog INT NOT NULL AUTO_INCREMENT,
      idUser INT NOT NULL,
      description VARCHAR(500) NULL,
      idEntity INT NOT NULL,
      type VARCHAR(45) NULL,
      value FLOAT NOT NULL,
      currency VARCHAR(45) NOT NULL,
      date DATETIME NOT NULL,
      PRIMARY KEY (idcashflowLog),
      INDEX FK_Users_idx (idUser ASC) VISIBLE,
      INDEX FK_Entities_idx (idEntity ASC) VISIBLE,
      CONSTRAINT FK_Users
        FOREIGN KEY (idUser)
        REFERENCES cashflowapp.users (idUsers)
        ON DELETE RESTRICT
        ON UPDATE NO ACTION,
      CONSTRAINT FK_Entities
        FOREIGN KEY (idEntity)
        REFERENCES cashflowapp.entities (idEntities)
        ON DELETE RESTRICT
        ON UPDATE NO ACTION)`
    db.query(createUsersTableQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Users table checked/created successfully.');
      }
    });
    db.query(createEntitiesTableQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Entities table checked/created successfully.');
      }
    })
    db.query(createCashflowLogTableQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Cashflow log table checked/created successfully.');
      }
    })
  }
});




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
