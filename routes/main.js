// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/weather', function(req, res, next){
    let apiKey = process.env.OPENWEATHER_API_KEY;
    let city = 'london';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            var weather = JSON.parse(body);
            if(weather.cod == 200){
                res.render('weather.ejs', {city:weather});
            }
            else{
                res.send(`Hmmmm... something went wrong.`);
            }
        } 
    });
});

router.get('/weather_result', function(req, res, next){
    let apiKey = process.env.OPENWEATHER_API_KEY;
    let city = req.sanitize(req.query.search_weather);
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            var weather = JSON.parse(body);
            if(weather.cod == 200){
                res.render('weather.ejs', {city:weather});
            }
            else{
                res.send(`City not found! Error code: ${weather.cod}`);
            }
        } 
    });
});

// Export the router object so index.js can access it
module.exports = router