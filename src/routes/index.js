const express = require('express')
const fs = require('fs')
const path = require('path');
const Services = require('../services')

var routes = express();
var router = express.Router();
var jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/final-json.in'), 'utf8'));

// set the Router Middleware
routes.use(router);
const services = new Services();

routes.get('/api/provinces', async (req, res) => {
  try {
    await res.status(200).json(services.getProvinces(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/departaments', async (req, res) => {
  try {
    await res.status(200).json(services.getDeparts(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/deps_by_prov/:prov', async (req, res) => {
  const prov = req.params.prov;
  try {
    await res
      .status(200)
      .json(services.getDepsByProv(`${prov}`, jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/total_dengue', async (req, res) => {
  try {
    await res.status(200).json(services.getTotalDengue(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/total_zika', async (req, res) => {
  try {
    await res.status(200).json(services.getTotalZika(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/provs_with_dengue_and_zika_cases', async (req, res) => {
  try {
    await res.status(200).json(services.getProvsWithDengueAndZikaCases(jsonData));
  } catch(err) {
    res.status(500).send(err)
  }
})

routes.get('/api/departaments', async (req, res) => {
  try {
    await res.status(200).json(services.getDeparts(jsonData));
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/api/:prov/total_deps_dengue_zika', async (req, res) => {
  let prov = req.params.prov
  try {
    await res.status(200).json(services.getDengueAndZikaByDep(prov, jsonData))
  } catch(err) {
    console.log(err)
    res.status(500).send(err)
  }
})

module.exports = routes;
