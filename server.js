import express from 'express';
import morgan from 'morgan';
import csv from 'csvtojson';
import http from 'http';
import path from 'path';
import csvjson from 'csvjson';
import bodyParser from 'body-parser';
import api from './routes';

var app = express();
var port = 3000;
//var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

app.use(morgan('dev'));
app.use(express.static('public'));
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

app.use(api);
app.get('/', (req, res) => {
  res.render('index', { text: 'text-1', text1: 'text-2' });
});

app.listen(port, () => console.log(`port ${port} listening...`));
