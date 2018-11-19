var express = require('express');
var app = express();
var URL_CSV = 'http://datos.salud.gob.ar/dataset/ceaa8e87-297e-4348-84b8-5c643e172500/resource/318834df-656d-4e71-9e87-195ebd96a0f8/download/informacion-publica-dengue-zika-nacional-hasta-20180821v2.csv';
var request = require('request');
var csv = require('csvtojson');
var http = require('http')
var fs = require('fs');
var path = require('path');
var csvjson = require('csvjson');

var bodyParser = require('body-parser');

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
var json_result = csvjson.toObject(file_data, options);
var data = JSON.stringify(json_result);
fs.writeFileSync('./json/final-json.in', data);
*/
// ******************************************************** //

var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

var isIn = (elem, arr) => {
  return(arr.indexOf(elem) != -1);
}

var getProvinces = (jss) => {
  let provinces = [];
  for(let i = 0; i<jss.length; i++) {
      if(!isIn(jss[i].provincia_nombre, provinces)){
          provinces.push(jss[i].provincia_nombre);
      }
  }
  return provinces;
}




var provinces = getProvinces(jsonData); // returns an array
var departs = getDeparts(jsonData); // returns an object
var totalDengueInfections = getZikaDengueInfections(jsonData)['dengue']; // returns an object
var totalZikaInfections = getZikaDengueInfections(jsonData)['zika']; // returns an integer
var totalInfections = totalZikaInfections + totalDengueInfections; // returns an integer
//var zikaByProvince = getZikaByProvince(jsonData);

/* End */

app.get('/', (req, res) => res.render('index', { provincias: provinces, departamentos: departs, dengue: totalDengueInfections, zika: totalZikaInfections}));


app.listen(3000, (req, res) => console.log('port 3000 listening...'));
