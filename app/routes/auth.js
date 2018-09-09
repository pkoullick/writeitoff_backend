var authController = require('../controllers/authcontroller.js');
var mysql = require('mysql');


var con = mysql.createConnection({
    host: process.env.HOST,
    user: "root",
    password: process.env.DBPASS,
    database: "test"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout',authController.logout);
    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.post('/signup', passport.authenticate('local-signup'), (req, res) => {
        res.send({
            isLoggedIn: true,
            email: req.body.email,
            phone: req.body.phone,
            userToken: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
    });

    app.post('/signin', passport.authenticate('local-signin'),  (req, res) => {
        con.query(`SELECT * from users where phone = '${req.body.phone}'`, function (err, result) {
            if (err) throw err;
            res.send({
                isLoggedIn: true,
                phone: req.body.phone,
                userToken: req.body.password,
                firstname: result[0].firstname,
                lastname: result[0].lastname
            });
        })
    });

    app.post('/get_bank_summary', passport.authenticate('local-signin'),  (req, res) => {
        con.query(`SELECT * from credentials where phone = '${req.body.phone}'`, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        })
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) 
            return next();    
        res.redirect('/signin');
    }
}


