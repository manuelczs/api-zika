import express from 'express';
import fs from 'fs';
import Services from '../services';

var routes = express();
var router = express.Router();
var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

// set the Router Middleware
routes.use(router);
const services = new Services();

routes.get('/api/provinces', (req, res) => {
  try {
    res.status(200).json(services.getProvinces(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/departaments', (req, res) => {
  try {
    res.status(200).json(services.getDeparts(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/deps_by_prov/:prov', (req, res) => {
  try {
    res
      .status(200)
      .json(services.getDepsByProv(`${req.params.prov}`, jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/total_dengue', (req, res) => {
  try {
    res.status(200).json(services.getTotalDengue(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/total_zika', (req, res) => {
  try {
    res.status(200).json(services.getTotalZika(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/departaments', (req, res) => {
  try {
    res.status(200).json(services.getDeparts(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = routes;
