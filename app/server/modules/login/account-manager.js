const crypto = require('crypto');
const MongoDB = require('mongodb').Db;
const Server = require('mongodb').Server;
const moment = require('moment');
moment.locale('ko');

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 9000;
const dbName = process.env.DB_NAME || 'JBS';

const db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w:1});
db.open((e,d) => {
  if (e) {
    console.log(e);
  } else {
    if (process.env.NODE_ENV == 'live') {
      db.authenticate(process.env.DB_USER, process.env.DB_PASS, (e, res) => {
        if (e) {
          console.log('mongo :: error: not authenticated', e);
        } else {
          console.log('mongo :: authenticated and connected to database :: "' + dbName + '"');
        }
      });
    } else {
      console.log('mongo :: connected to database :: "' + dbName + '"');
    }
  }
});

const accounts = db.collection('accounts');

exports.autoLogin = (user, pass, callback) => {
  accounts.findOne({user: user}, (e, o) => {
    if (o) {
      o.pass == pass ? callback(o) : callback(null);
    } else {
      callback(null);
    }
  });
};

exports.manualLogin = (user, pass, callback) => {
  accounts.findOne({user: user}, (e, o) => {
    if (o == null) {
      callback('user-not-found');
    } else {
      validatePassword(pass, o.pass, (err, res) => {
        if (res) {
          callback(null, o);
        } else {
          callback('invalid-password');
        }
      });
    }
  });
};

exports.addNewAccount = (newData, callback) => {
  accounts.findOne({user: newData.user}, (e,o) => {
    if (o) {
      callback('username-taken');
    } else {
      accounts.findOne({email: newData.email}, (e, o) => {
        if (o) {
          callback('email-taken');
        } else {
          saltAndHash(newData.pass, (hash) => {
            newData.pass = hash;
            newData.date = moment().format('YYYY/MM/DD HH:mm:ss');
            accounts.insert(newData, {safe: true}, callback);
          });
        }
      });
    }
  });
};

exports.getAccountByEmail = (email, callback) => {
  accounts.findOne({email: email}, (e, o) => {
    callback(o);
  });
};

exports.validateResetLink = (email, passHash, callback) => {
  accounts.find({ $and: [{email: email, pass:passHash}] }, (e, o) => {
    callback(o ? 'ok' : null);
  });
};

exports.updatePassword = (email, newPass, callback) => {
  accounts.findOne({email: email}, (e, o) => {
    if (e) {
      callback(e, null);
    } else {
      saltAndHash(newPass, (hash) => {
        o.pass = hash;
        accounts.save(o, {safe: true}, callback);
      });
    }
  });
};

const generateSalt = function() {
    let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    let salt = '';
    for (let i = 0; i < 10; i++) {
      let p = Math.floor(Math.random() * set.length);
      salt += set[p];
    }
    return salt;
};

const md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

const saltAndHash = function(pass, callback) {
  let salt = generateSalt();
  callback(salt + md5(pass + salt));
};

const validatePassword = function(plainPass, hashedPass, callback) {
  let salt = hashedPass.substr(0, 10);
  let validHash = salt + md5(plainPass + salt);
  callback(null, hashedPass  === validHash);
};