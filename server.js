import express from 'express';
import morgan from 'morgan';
import csv from 'csvtojson';
import axios from 'axios';
import http from 'http';
import path from 'path';
import csvjson from 'csvjson';
import api from './routes';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const navigation = [
  { link: '/', name: 'Casos' },
  { link: '/map', name: 'Mapa' },
  { link: '/contact', name: 'Contacto' },
];
//const API_KEY = 'AIzaSyAUYDtv51kgaUx_wEw3bfWkoSiYrXuKGlA';
//var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

app.use(morgan('dev'));
app.use(express.static('public'));
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
  res.render('index', { text: 'text-1', text1: 'text-2', navigation });
});

app.get('/map', (req, res) => {
  let provinces = [];
  let provs_coords = [];
  let provs_country = [];

  axios
    .get('http://localhost:3000/api/provinces')
    .then((response) => {
      provinces = response.data.provinces;

      provs_country = provinces.map((prov) => prov + ', Argentina');
      //for (let i = 0; i < provinces.length; i++) {
      //  provs_country.push(provinces[i] + ', Argentina');
      //}

      provs_country.map((prov) => {
        axios
          .get(
            `ttps://maps.googleapis.com/maps/api/geocode/json?address=${prov}&key=${process.env.API_KEY}`
          )
          .then((response) => {
            provs_coords.push(response.data.results[0].geometry.location);
            //console.log(response.data.results[0].geometry.location);
          })
          .catch((e) => {
            console.log(e);
          });
      });

      //for (let i = 0; i < provinces.length; i++) {
      //  let LOCATION = provs_country[i];
      //  let url_api = `https://maps.googleapis.com/maps/api/geocode/json?address=${LOCATION}&key=${API_KEY}`;
      // Change this above line
      //let position = $.getJSON(url_api).responseJSON.results[0].geometry.location;
      //  provs_coords.push(position);
      // }
    })
    .then(() => {
      res.render('map', { navigation, provinces, provs_coords });
    })
    .catch((err) => {
      console.log('There was an error: ' + err);
    });
});

app.get('/contact', (req, res) => {
  res.render('contact', { navigation });
});

app.listen(port, () => console.log(`port ${port} listening...`));
