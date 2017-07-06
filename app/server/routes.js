const AM = require('./modules/login/account-manager');

module.exports = function(app) {
  app.get('/', (req, res) => {
    if (req.cookies.user == undefined || req.cookies.pass == undefined) {
      // render login page
      res.render('account/login', {title: 'Login'});
    } else {
      // attempt automatic login
      AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
        if (o != null) {
          req.session.user = o;
          res.redirect('/home');
        } else {
          res.render('account/login', {title: 'Login'});
        }
      });
    }
  });

  app.post('/', (req, res) => {
    AM.manualLogin(req.body['user'], req.body['pass'], (e, o) => {
      if (!o) {
        res.status(400).send(e);
      } else {
        req.session.user = o;
        if (req.body['remember-me'] == 'true') {
          console.log("set cookie");
          res.cookie('user', o.user, {maxAge: 900000 });
          res.cookie('pass', o.pass, {maxAge: 900000 });
        }
        res.status(200).send(o);
      }
    });
  });

  app.get('/signup', (req, res) => {
    res.render('account/signup', { title: 'Signup'});
  });

  app.post('/signup', (req, res) => {
    AM.addNewAccount({
      name: req.body['name'],
      email: req.body['email'],
      user: req.body['user'],
      pass: req.body['pass']
    }, function(e) {
      if (e) {
        res.status(400).send(e);
      } else {
        res.status(200).send('ok');
      }
    })
  });

  app.get('/home', (req, res) => {
    if (req.session.user == null) {
      res.redirect('/');
    } else {
      res.render('home', {
        title: 'Home'
      });
    }
  });
};