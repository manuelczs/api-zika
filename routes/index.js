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
  const prov = req.params.prov;
  try {
    res
      .status(200)
      .json(services.getDepsByProv(`${prov}`, jsonData));
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

routes.get('/api/provs_with_dengue_and_zika_cases', (req, res) => {
  try {
    res.status(200).json(services.getProvsWithDengueAndZikaCases(jsonData));
  } catch(err) {
    res.status(500).send(err)
  }
})

routes.get('/api/departaments', (req, res) => {
  try {
    res.status(200).json(services.getDeparts(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/:prov/total_deps_dengue_zika', (req, res) => {
  let prov = req.params.prov
  try {
    res.status(200).json(services.getDengueAndZikaByDep(prov, jsonData))
  } catch(err) {
    console.log(err)
    res.status(500).send(err)
  }
})

module.exports = routes;
