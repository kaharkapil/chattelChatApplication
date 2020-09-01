const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const mongoose = require('mongoose');
const morgan = require('morgan');



app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

app.use(express.static(path.join(__dirname, 'client')));




const modelsPath = './app/models';
const controllersPath = './app/controllers';
const libsPath = './app/libs';
const middlewaresPath = './app/middlewares';
const routesPath = './app/routes';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

// Bootstrap route
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});
// end bootstrap route

app.use(globalErrorMiddleware.globalNotFoundHandler);



// Create HTTP server.
 

const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);



// socket io connection handler 
const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);






// Event listener for HTTP server "error" event.
 

function onError(error) {
  if (error.syscall !== 'listen') {
    console.log(error)
    throw error;
  }


  // other errors
  switch (error.code) {
    case 'EACCES':
      console.log("elavated privileges required")

    process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(":port is already in use");
      process.exit(1);
      break;
    default:
      console.log(":some unknown error occured")
      throw error;
  }
}


// Event listener for HTTP server "listening" event.
 

function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  ('Listening on ' + bind);
  console.log('server listening on port:'+appConfig.port)
  let db = mongoose.connect(appConfig.db.uri,{ useMongoClient: true });
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});



// database connection settings

mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err)
});

mongoose.connection.on('open', function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
  } else {
    console.log("database connection open success");
  }
});


// creating Dummy Users
/*const UserModel=mongoose.model('User')
 let createUser = () => {
     console.log('creating user')
                    let newUser = new UserModel({
                         userId: 'socket20202',
                         Name: 'User2',
                         authToken:'authTokenForUser2'
                     })
                     newUser.save((err, newUser) => {
                         if (err) {
                             console.log(err)
                         } else {
                             let newUserObj = newUser.toObject();
                             console.log("user created successfully")
                             console.log(newUserObj)
                         }
                     })
};
createUser();
*/


module.exports = app;
