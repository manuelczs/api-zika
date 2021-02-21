var express = require('express');
var routes = express();
var fs = require('fs');
var router = express.Router();
var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));
var codes = require('../services');

// set the Router Middleware
routes.use(router);

routes.get('/api/provinces', (req, res) => {
  if (jsonData) {
    res.status(200).json(codes.getProvinces(jsonData));
  } else {
    res.send('Nothing here');
  }
});

routes.get('/api/departaments', (req, res) => {
  res.status(200).json(codes.getDeparts(jsonData));
});

routes.get('/api/deps_by_prov/:prov', (req, res) => {
  res.status(200).json(codes.getDepsByProv(`${req.params.prov}`, jsonData));
});

routes.get('/api/total_dengue', (req, res) => {
  res.status(200).json(codes.getTotalDengue(jsonData));
});

routes.get('/api/total_zika', (req, res) => {
  res.status(200).json(codes.getTotalZika(jsonData));
});

routes.get('/api/departaments', (req, res) => {
  res.status(200).json(codes.getDeparts(jsonData));
});

module.exports = routes;
