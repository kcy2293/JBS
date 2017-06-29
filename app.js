const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');

const app = express();
app.locals.pretty = true;
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/app/server/views');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('stylus').middleware({src: __dirname + '/app/public'}));
app.use(express.static(__dirname + '/app/public'));
app.use(logger('dev'));

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 9000;
const dbName = process.env.DB_NAME || 'JBS';

let dbURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
if (app.get('env') == 'live') {
  dbURL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + dbHost + ':' + dbPort + '/' + dbName;
}

app.use(session({
  secret: 'jbstockmanagenetsystem20170629',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: dbURL })
}));

//require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});