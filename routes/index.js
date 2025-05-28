var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(userModel.authenticate()));
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    name: req.body.fullname,
    role: req.body.role || 'user' // Set role, default is 'user'
  });

  userModel.register(data, req.body.password)
    .then((registeredUser) => {
      // Authenticate the user and check the role for redirection
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/');
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Check the user's role after logging in
          if (user.role === 'admin') {
            return res.redirect('/admin'); // Redirect to admin page
          } else {
            return res.redirect('/profile'); // Redirect to profile page
          }
        });
      })(req, res, next);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error registering user');
    });
});

  
router.get('/profile',isLoggedIn, (req, res) => {
  res.render('profile');
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/'); //  to home if no user found
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (user.role === 'admin') {
        return res.redirect('/admin'); //  to admin page
      } else {
        return res.redirect('/profile'); //  to profile page
      }
    });
  })(req, res, next);
});


router.get('/admin', isAdmin, (req, res) => {
  res.render('admin'); // Render the admin dashboard or panel
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/profile');
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  } else {
    res.status(403).send('Access Denied: You are not an admin');
  }
}



module.exports = router;


