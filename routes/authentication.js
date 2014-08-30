module.exports = function(app, models) {
  app.post('/login', function(req, res) {
    var email = req.param('email', null);
    var password = req.param('password', null);
  
    if ( null == email || email.length < 1
        || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.Account.login(email, password, function(account) {
      if ( !account ) {
        res.send(401);
        return;
      }
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      res.send(200);
    });
  });
  
  app.post('/FBlogin', function(req, res) {
    var id = req.param('id', null);
     
    models.Account.findByIdFacebook(id, function(account) {
      if ( !account ) {
        res.send(401);
        return;
      }
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      res.send(200);
    });
  });
  
  app.post('/register', function(req, res) {
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);
  
    if ( null == email || email.length < 1
         || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.Account.register(email, password, firstName, lastName);
    res.send(200);
  });
   
  app.post('/FBregister', function(req, res) {
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var facebookID = req.param('uid', null);
    var foto = req.param('foto', null);
    
    models.Account.registerFacebook(email, firstName, lastName, facebookID, foto);
    res.send(200);
  });
  
  app.get('/account/authenticated', function(req, res) {
    if ( req.session && req.session.loggedIn ) {
      res.send(200);
    } else {
      res.send(401);
    }
  });
  
  app.post('/forgotpassword', function(req, res) {
    var hostname = req.headers.host;
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    var email = req.param('email', null);
    if ( null == email || email.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.Account.forgotPassword(email, resetPasswordUrl, function(success){
      if (success) {
        res.send(200);
      } else {
        // Username or password not found
        res.send(404);
      }
    });
  });

  app.get('/resetPassword', function(req, res) {
    var accountId = req.param('account', null);
    res.render('resetPassword.jade', {locals:{accountId:accountId}});
  });
  
  app.post('/resetPassword', function(req, res) {
    var accountId = req.param('accountId', null);
    var password = req.param('password', null);
    if ( null != accountId && null != password ) {
      models.Account.changePassword(accountId, password);
    }
    res.render('resetPasswordSuccess.jade');
  });
}