import express from 'express';
import morgan from 'morgan';
import csv from 'csvtojson';
import axios from 'axios';
import http from 'http';
import path from 'path';
import csvjson from 'csvjson';
import api from './routes';
import config from './config'
import cors from 'cors'

const corsOptions = {
  origin: 'https://manux.ar',
  optionsSuccessStatus: 200
}

const app = express();
const port = config.port || 4000;
const navigation = [
  { link: '/', name: 'Casos' },
  { link: '/map', name: 'Mapa' },
  { link: '/contact', name: 'Contacto' }
];
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');
const URL_API = 'http://localhost:3000/api/';

/*
var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'))
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


app.use(api);
app.get('/', cors(corsOptions), async (req, res) => {
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
  let provinces_ = [];
  let provs_coords = [];
  let provs_coords_w = [];
  let PROVINCES_API_URL = 'http://localhost:3000/api/provinces';
  let MAP_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
  const URL_PROVS_WITH_ALL_CASES = 'http://localhost:3000/api/provs_with_dengue_and_zika_cases';

  const getProvsWithAllCases = async() => {
    try {
      const response = await axios.get(URL_PROVS_WITH_ALL_CASES)
      return response.data
    } catch(err) {
      console.log(err)
    }
  }

  const replace_prov = (provs) => {
    let provs_replaced = [...provs]
    if(provs.includes('Córdoba')) {
      provs_replaced[provs_replaced.indexOf('Córdoba')] = 'Cordoba'
    }
    
    if(provs.includes('Entre Ríos')) {
      provs_replaced[provs_replaced.indexOf('Entre Ríos')] = 'Entre Rios'
    } 
    
    if(provs.includes('Río Negro')) {
      provs_replaced[provs_replaced.indexOf('Río Negro')]
    }
    
    if(provs.includes('Tucumán')) {
      provs_replaced[provs_replaced.indexOf('Tucumán')] = 'Tucuman'
    }

    return provs_replaced
  }

  /* Call to getProvsWithAllCases */
  const provsWithAllCases = await getProvsWithAllCases();


  /* GET all province names */
  try {
    const response = await axios.get(PROVINCES_API_URL);
    
    provinces_ = await response.data.provinces
    provinces = replace_prov(provinces_);
    provinces = provinces.map(prov => prov.replaceAll(' ', '+') + '+Argentina');
  } catch(err) {
    console.error(err)
  }

  try {
    for(let i=0; i<provinces.length; i++) {
      let response = '';
      response = await axios.get(MAP_URL + provinces[i] + `&key=${config.apiKeyGoogle}`);
      provs_coords.push(response.data.results[0].geometry.location);
    }

    for(let i=0; i<provinces_.length; i++) {
      provs_coords_w.push({
        province: provinces_[i],
        coords: provs_coords[i], 
        dengue: provsWithAllCases[i].totalDengue, 
        zika: provsWithAllCases[i].totalZika
      })
    }

  } catch(err) {
    console.error(err);
  }

  res.render('index', { page: 'map', navigation, provs_coords_w })
})

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
