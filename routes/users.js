// Create a new router
const express = require("express")
const { check, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcrypt');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

function loginAudit(username, attemptRslt, ip) {
    let sqlquery = "INSERT INTO loginAudit (username, attemptRslt, ip_address) VALUES (?, ?, ?)";
    audit = [username, attemptRslt, ip]

    db.query(sqlquery, audit, () => {});
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', [check('email').isEmail(), check('username').isLength({ min: 5, max: 20}), check('password').isLength({min: 8}), check('last').isAlpha()], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else {
        // saving data in database
        const saltRounds = 10;
        const plainPassword = req.body.password;
        
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // Store hashed password in your database.
            let sqlquery = "INSERT INTO userDetails (username, fname, lname, email, hashedPass) VALUES (?,?,?,?,?)"
            let newUser = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];

            db.query(sqlquery, newUser, function(err, result){
                if(err){
                    next(err);
                }
            })

            result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email);
            result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(result);

        });
    }
}); 


router.get('/listusers', function(req, res, next) {
    let sqlquery = "SELECT * FROM userDetails"; // query database to get all the books
    
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("listusers.ejs", {users:result})
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedin', check('username').isLength({ min: 5, max: 20}), function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./login')
    }
    else {
        // Compare the password supplied with the password in the database
        let sqlquery = "SELECT hashedPass FROM userDetails WHERE username=?";
        let username = [req.sanitize(req.body.username)];

        db.query(sqlquery, username, (err, result) => {
            if(err){
                next(err);
            }
            else if (result.length == 0) {
                loginAudit(username, 'Failed - User not found', req.ip);
                res.send('Your credentials do not exist in the database.');
            }
            else{
                hashedPassword = result[0].hashedPass;
                bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                    if (err) {
                        // TODO: Handle error
                        next(err)
                    }
                    else if (result == true) {
                        // TODO: Send message
                        loginAudit(username, 'Success', req.ip);
                        // Save user session here, when login is successful
                        req.session.userId = req.sanitize(req.body.username);
                        res.send('Password matches!')
                    }
                    else {
                        // TODO: Send message
                        loginAudit(username, 'Failed - Incorrect password', req.ip);
                        res.send('You may not pass filthy stinky crusty dusty musty intuder!')
                    }
                })
            }
        })
    }
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('../')
        }
        res.send('you are now logged out. <a href='+'../'+'>Home</a>');
    })
})


router.get('/audit', function (req, res, next) {
    let sqlquery = "SELECT * FROM loginAudit"; // query database to get all the books
    
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("audit.ejs", {audit:result})
    });
})

// Export the router object so index.js can access it
module.exports = {
    router: router,
    redirectLogin: redirectLogin
};
