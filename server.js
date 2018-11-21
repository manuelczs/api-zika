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

var getDeparts = (jss) => {
  let departs = [];
  for(let i = 0; i<jss.length; i++) {
    if(departs.indexOf(jss[i].departamento_nombre) == -1) {
      departs.push(jss[i].departamento_nombre)
    }
  }
  return departs;
}

var getDepsByProv = (prov, jss) => {
  let lss = []
  for(let i = 0; i<jss.length; i++) {
    if(jss[i].provincia_nombre == prov && lss.indexOf(jss[i].departamento_nombre) == -1) {
      lss.push(jss[i].departamento_nombre);
    }
  }
  return lss;
}

var getDepsOfProvs = (jss) => {
  let provs = getProvinces(jss);
  let result = [];

  for(let i = 0; i<provs.length; i++) {
    let liss = getDepsByProv(provs[i], jss);
    result.push({ provincia: provs[i], departamentos: liss });
  }
  return result;
}

var getTotalDengue = (jss) => {
  let totalDengue = 0;
  let result = 0;
  for(let i = 0; i<jss.length; i++) {
    if(jss[i].evento_nombre == 'Dengue') {
      totalDengue += Number(jss[i].cantidad_casos);
    }
  }
  return totalDengue;
}

var getTotalZika = (jss) => {
  let totalZika = 0;
  for(let i = 0; i<jss.length; i++) {
    if(jss[i].evento_nombre == 'Enfermedad por Virus del Zika') {
      totalZika += Number(jss[i].cantidad_casos);
    }
  }
  return totalZika;
}

var provinces = getProvinces(jsonData); // returns an array
var departs = getDeparts(jsonData); // returns an object
var totalDengueInfections = getTotalDengue(jsonData); // returns an object
var totalZikaInfections = getTotalZika(jsonData); // returns an integer
var totalInfections = totalZikaInfections + totalDengueInfections; // returns an integer
//var zikaByProvince = getZikaByProvince(jsonData);

exports.provincias = provinces;
exports.departamentos = departs;

/* End */

app.get('/', (req, res) => res.render('index', { provincias: provinces, departamentos: departs, dengue: totalDengueInfections, zika: totalZikaInfections}));
app.listen(3000, (req, res) => console.log('port 3000 listening...'));