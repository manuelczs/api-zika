var express = require('express');
var app = express();
var morgan = require('morgan');
var request = require('request');
var csv = require('csvtojson');
var http = require('http');
var fs = require('fs');
var path = require('path');
var csvjson = require('csvjson');
var bodyParser = require('body-parser');
var routes = require('./routes');
var port = 4000;
//var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// ******************************************************** //
/*
var request = http.get(URL_CSV, function(response) {
    if (response.statusCode === 200) {
        var file = fs.createWriteStream("./csv/file.csv");
        response.pipe(file);
    }
    // Add timeout.
    request.setTimeout(12000, function () {
        request.abort();
    });
});
var options = {
  delimiter: ',',
  quote: '"'
};
var file_data = fs.readFileSync('./csv/file.csv', { encoding: 'utf8' });
var json_result = csvjson.toObject(file_+data, options);
var data = JSON.stringify(json_result);
fs.writeFileSync('./json/final-json.in', data);
*/
// ******************************************************** //

/* End */

app.use(routes);
app.get('/', (req, res) => {
  res.render('index', { text: 'text-1', text1: 'text-2' });
});
app.listen(port, () => console.log('port 3000 listening...'));
