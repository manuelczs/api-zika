import express from 'express';
import fs from 'fs';
import services from '../services';

var routes = express();
var router = express.Router();
var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

// set the Router Middleware
routes.use(router);

routes.get('/api/provinces', (req, res) => {
  if (jsonData) {
    res.status(200).json(services.getProvinces(jsonData));
  } else {
    res.send('Nothing here');
  }
});

routes.get('/api/departaments', (req, res) => {
  res.status(200).json(services.getDeparts(jsonData));
});

routes.get('/api/deps_by_prov/:prov', (req, res) => {
  res.status(200).json(services.getDepsByProv(`${req.params.prov}`, jsonData));
});

routes.get('/api/total_dengue', (req, res) => {
  res.status(200).json(services.getTotalDengue(jsonData));
});

routes.get('/api/total_zika', (req, res) => {
  res.status(200).json(services.getTotalZika(jsonData));
});

routes.get('/api/departaments', (req, res) => {
  res.status(200).json(services.getDeparts(jsonData));
});

module.exports = routes;
