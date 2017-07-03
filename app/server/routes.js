module.exports = function(app) {
  app.get('/', (req, res) => {
    if (req.cookies.user == undefined || req.cookies.pass == undefined) {
      // render login page
      res.render('login', {title: 'Login'});
    } else {
      // attempt automatic login
    }
  });
};