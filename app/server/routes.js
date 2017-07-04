const AM = require('./modules/login/account-manager');

module.exports = function(app) {
  app.get('/', (req, res) => {
    if (req.cookies.user == undefined || req.cookies.pass == undefined) {
      // render login page
      res.render('account/login', {title: 'Login'});
    } else {
      // attempt automatic login
    }
  });


  app.post('/', (req, res) => {

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
};