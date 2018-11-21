var fs = require('fs');
var path = require('path');
var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));


var isIn = (elem, arr) => {
    return(arr.indexOf(elem) != -1);
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


module.exports = {

  getProvinces: (jss) => {
    let provinces = [];
    for(let i = 0; i<jss.length; i++) {
        if(!isIn(jss[i].provincia_nombre, provinces)){
            provinces.push(jss[i].provincia_nombre);
        }
    }
    return provinces;
  },

  getDeparts: (jss) => {
    let departs = [];
    for(let i = 0; i<jss.length; i++) {
      if(departs.indexOf(jss[i].departamento_nombre) == -1) {
        departs.push(jss[i].departamento_nombre)
      }
    }
    return departs;
  },

  getDepsByProv: (prov, jss) => {
    let lss = []
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].provincia_nombre == prov && lss.indexOf(jss[i].departamento_nombre) == -1) {
        lss.push(jss[i].departamento_nombre);
      }
    }
    return lss;
  },

  getDepsOfProvs: (jss) => {
    let provs = getProvinces(jss);
    let result = [];

    for(let i = 0; i<provs.length; i++) {
      let liss = getDepsByProv(provs[i], jss);
      result.push({ provincia: provs[i], departamentos: liss });
    }
    return result;
  },

  getTotalDengue: (jss) => {
    let totalDengue = 0;
    let result = 0;
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].evento_nombre == 'Dengue') {
        totalDengue += Number(jss[i].cantidad_casos);
      }
    }
    return totalDengue;
  },

  getTotalZika: (jss) => {
    let totalZika = 0;
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].evento_nombre == 'Enfermedad por Virus del Zika') {
        totalZika += Number(jss[i].cantidad_casos);
      }
    }
    return totalZika;
  },

  getDepsByProv_: (prov) => {
    let provs = [];
    provs = getDepsByProv(prov, jsonData);
    return provs;
  }

};