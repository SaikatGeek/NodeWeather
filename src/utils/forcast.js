const request = require('request');

const forcast = (lat, long, callback) => {
const url = `https://api.darksky.net/forecast/${process.env.WEATHER_SECRET_KEY}/${lat},${long}`;

    request({ url, json: true }, (error, { body }) => {
        if(error) {
            callback('Error: unable to connect to forcast weather services', undefined);
        } else if(body.length === 0) {
            callback('Error: Unable to find your input location', undefined);
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability + '% of rain.')
        }
    });
}

module.exports = forcast;