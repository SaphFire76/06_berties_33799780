// Create a new router
const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM books"
    let searchData = [];

    // Search books
    if(req.query.search) {
        let keyword = req.sanitize(req.query.search);
        if(sqlquery.includes("WHERE")) {
            sqlquery += " AND name LIKE ?"
        } 
        else{
            sqlquery += " WHERE name LIKE ?"
        }
        
        searchData.push('%' + keyword + '%')
    }

    // Min price
    if(req.query.minprice) {
        let keyword = req.sanitize(req.query.minprice)
        if(sqlquery.includes("WHERE")) {
            sqlquery += " AND price >= ?"
        } 
        else{
            sqlquery += " WHERE price >= ?"
        }
        
        searchData.push(keyword)
    }

    // Max price
    if(req.query.max_price) {
        let keyword = req.sanitize(req.query.max_price)
        if(sqlquery.includes("WHERE")) {
            sqlquery += " AND price <= ?"
        } 
        else{
            sqlquery += " WHERE price <= ?"
        }
        
        searchData.push(keyword)
    }

    // Sort
    if(req.query.sort) {
        let sortParam = req.query.sort; 

        if(sortParam === 'name' || sortParam === 'price') {
            sqlquery += " ORDER BY " + sortParam;
        }
    }

    // Execute the sql query
    db.query(sqlquery, searchData, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router