const AM = require('./modules/login/account-manager');
const EM = require('./modules/login/email-dispatcher');

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

  app.post('/lost-password', (req, res) => {
    AM.getAccountByEmail(req.body['email'], (o) => {
      if (o) {
        console.log(o);
        EM.dispatchResetPasswordLink(o, (e, m) => {
          if (!e) {
            res.status(200).send('ok');
          } else {
            for (k in e) console.log('ERROR : ', k, e[k]);
            res.status(400).send('Unable to dispatch password reset');
          }
        });
      } else {
        res.status(400).send('email-not-found');
      }
    });
  });

  app.get('/reset-password', (req, res) => {
    const email = req.query["e"];
    const passH = req.query["p"];

    AM.validateResetLink(email, passH, (e) => {
      if (e != 'ok') {
        res.redirect('/');
      } else {
        req.session.reset = { email: email, passHash: passH };
        res.render('account/reset', {title : '비밀번호 재설정'});
      }
    });
  });

  app.post('/reset-password', (req, res) => {
    let nPass = req.body['pass'];
    let email = req.session.reset.email;

    req.session.destroy();
    AM.updatePassword(email, nPass, (e, o) => {
      if (o) {
        res.status(200).send('ok');
      } else {
        res.status(400).send('unable to update password');
      }
    });
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