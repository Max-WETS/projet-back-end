const passport = require('passport');
const User = require('./models/user');
const router = require('express').Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };

router.get('/', (req, res) => {
res.render('login');
});
  
router.get('/registration', (req, res) => {
res.render('registration');
})
    
router.post('/registration', (req, res, next) => {

    User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
        console.log(err);
        res.redirect('/registration');
    } else {
        passport.authenticate('local')(req, res, function() {
            res.redirect('/menu');
        })
       }
      });
    });
      
router.post('/', function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/menu');
            })
        }
    })
});
      
router.get('/menu',  ensureAuthenticated, (req, res) => {
    res.render('menu', { sessionUsername: res.locals.currentUser.username });
});
      
      
router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
      });
  
router.get('/menu/game', (req, res) => {
    ensureAuthenticated,
    res.render('game', { sessionUsername: res.locals.currentUser.username });
  });
  
module.exports = router;
  