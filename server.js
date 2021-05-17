import express from 'express';
import morgan from 'morgan';
import csv from 'csvtojson';
import axios from 'axios';
import http from 'http';
import path from 'path';
import csvjson from 'csvjson';
import api from './routes';
import config from './config'

const app = express();
const port = config.port || 4000;
const navigation = [
  { link: '/', name: 'Casos' },
  { link: '/map', name: 'Mapa' },
  { link: '/contact', name: 'Contacto' }
];

//var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');
const URL_API = 'http://localhost:3000/api/';

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
app.get('/', async (req, res) => {
  let totalDengue = 0;
  let totalZika = 0;
  let allProvinces = [];
  let allDepartaments = [];
  let provsWithDengueAndZika = [];

  await axios.get(URL_API + 'total_dengue').then(response => {
    totalDengue = response.data.totalDengue;
    //console.log('total dengue: ' + totalDengue)
  }).catch(err => { console.log(err)});

  await axios.get(URL_API + 'total_zika').then(response => {
    totalZika = response.data.totalZika;
    //console.log('total zika: ' + totalZika)
  }).catch(err => { console.log(err) })

  await axios.get(URL_API + 'provinces').then(response => {
    allProvinces = response.data.provinces;
    //console.log('Provinces: ' + allProvinces)
  }).catch(err => { console.log(err) })

  await axios.get(URL_API + 'departaments').then(response => {
    allDepartaments = response.data.departaments;
    //console.log('Deps: ' + allDepartaments);
  }).catch(err => { console.log(err) })

  await axios.get(URL_API + 'provs_with_dengue_and_zika_cases').then(response => {
    provsWithDengueAndZika = response.data;
  }).catch(err => { console.log(err) })

  res.render('index', {
    navigation,
    page: 'home',
    totalDengue,
    totalZika,
    allProvinces,
    allDepartaments,
    provsWithDengueAndZika
  });
});

/* Map route */
app.get('/map', async (req, res) => {
  let provinces = [];
  let provs_coords = [];

  let PROVINCES_API_URL = 'http://localhost:3000/api/provinces';
  let MAP_URL = `hps://maps.googleapis.com/maps/api/geocode/json?address=`;

  /* GET all province names */

  try {
    const response = await axios.get(PROVINCES_API_URL);
    provinces = await response.data.provinces.map(prov => prov.replaceAll(' ', '+') + '+Argentina');
    console.log(provinces)
  } catch(err) {
    console.error(err)
  }

  try {

    for(let i=0; i<provinces.length; i++) {
      let response = '';
      response = await axios.get(MAP_URL + provinces[i] + `&key=${config.apiKeyGoogle}`);
      provs_coords.push(response.data.results[0].geometry.location);
    }

  } catch(err) {
    console.error(err);
  }

  res.render('index', { page: 'map', navigation, provs_coords })
})



/*
.then(() => {
  provs_argentina.map((prov) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${prov}&key=${config.apiKeyGoogle}`
      )
      .then((response) => {
        provs_coords.push(response.data.results[0].geometry.location);
        console.log(provs_coords)
      }).then(() => {
        //res.render('index', { navigation, provs_coords, page: 'map' });
        console.log('xxx')
      })
      .catch((e) => {
        console.log(e);
      });
  });
})
*/


app.get('/contact', (req, res) => {
  res.render('index', { navigation, page: 'contact' });
});

app.get('/prov/:provName', async(req, res) => {
  const prov = req.params.provName;
  let deps = [];
  await axios.get(URL_API + `deps_by_prov/${prov}`).then(response => {
    deps = response.data.deps;
    console.log(deps)
  }).catch(err => {
    console.log(err)
  })

  res.render('index', { navigation, page: 'deps', prov, deps });
})

app.get('/:provName/total_deps_dengue_zika', async(req, res) => {
  const prov = req.params.provName;
  let totalDengueProv = 0;
  let totalZikaProv = 0;
  let deps = [];

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  await axios.get(URL_API + `${prov}/total_deps_dengue_zika`).then(response => {
    deps = response.data.data;
    totalDengueProv = deps.map(prov => prov.dengueCases).reduce(reducer)
    totalZikaProv = deps.map(prov => prov.zikaCases).reduce(reducer)

  }).catch(err => {
    console.log(err)
  })

  res.render('index', { navigation, page: 'deps', prov, deps, totalDengueProv, totalZikaProv });
})

app.listen(port, () => console.log(`port ${port} listening...`));
