// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');

function loginAudit(username, attemptRslt, ip) {
    let sqlquery = "INSERT INTO loginaudit (username, attemptRslt, ip_address) VALUES (?, ?, ?)";
    audit = [username, attemptRslt, ip]

    db.query(sqlquery, audit, () => {});
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // saving data in database
    const saltRounds = 10;
    const plainPassword = req.body.password;
    
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        let sqlquery = "INSERT INTO userDetails (username, fname, lname, email, hashedPass) VALUES (?,?,?,?,?)"
        let newUser = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlquery, newUser, function(err, result){
            if(err){
                next(err);
            }
        })

        result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
        result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
        res.send(result);

    });
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

router.post('/loggedin', function (req, res, next) {
    // Compare the password supplied with the password in the database
    let sqlquery = "SELECT hashedPass FROM userDetails WHERE username=?";
    let username = [req.body.username];

    db.query(sqlquery, username, (err, result) => {
        if(err){
            next(err);
        }
        hashedPassword = result[0].hashedPass;
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                // TODO: Handle error
                next(err)
            }
            else if (result == true) {
                // TODO: Send message
                loginAudit(username, 'Success', req.ip);
                res.send('Password matches!')
            }
            else {
                // TODO: Send message
                loginAudit(username, 'Failed', req.ip);
                res.send('You may not pass filthy stinky crusty dusty intuder!')
            }
        })
    })

})

router.get('/audit', function (req, res, next) {
    let sqlquery = "SELECT * FROM loginaudit"; // query database to get all the books
    
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("audit.ejs", {audit:result})
    });
})

// Export the router object so index.js can access it
module.exports = router
