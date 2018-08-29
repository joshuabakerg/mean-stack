var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var services = require('./routes/services');

/*mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://test:test@dhtnbdevop01.discovery.holdings.co.za:27017/Devops", { useNewUrlParser: true , promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));*/


var app = express();

app.use((req, res, next) => {
  const auth = {login: 'yourlogin', password: 'yourpassword'}; // change this

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');

  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
    res.status(401).send('Authentication required.'); // custom message
    return
  }
  next()
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/view', express.static(path.join(__dirname, 'dist')));
app.use('/view/*', express.static(path.join(__dirname, 'dist')));
app.use('/services', services);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
