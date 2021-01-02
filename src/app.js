require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forcast = require('./utils/forcast');

const app = express();
const port = process.env.PORT || 3000;

// Path definitions for express confirguration
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//set express to use handlebars templating engine
app.set('view engine', 'hbs');
//set the template folder dir for hbs views
app.set('views', viewsPath);
//set the partials folder for hbs to use
hbs.registerPartials(partialsPath);

//express static route to main dir
app.use(express.static(publicDirPath));

//get request to route handlebars page
app.get('', (req, res) => {
    //res.render page filename and then object data
    res.render('index', {
        title: 'Weather App',
        name: 'Mike'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Mike'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Mike',
        description: 'This is the help page'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if(error) {
           return res.send({ error })
        }
        //Forcast finds the weather summary
        //Forcast uses the data object from geocode
        forcast(latitude, longitude, (error, forcastData) => {
            if(error) {
                return res.send({ error })
             }
            //Data Return if all error false
            res.send({
                forecast: forcastData,
                location,
                address: req.query.address
            })
        });
    });

})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

//404 Routes
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help 404',
        errorMsg: 'Help article not found!'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMsg: 'Page not found!'
    })
});
 
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});