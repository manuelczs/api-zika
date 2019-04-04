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
    let value = [];
    for(let i = 0; i<jss.length; i++) {
        if(!isIn(jss[i].provincia_nombre, value)){
            value.push(jss[i].provincia_nombre);
        }
    }
    return { provinces: value };
  },

  getDeparts: (jss) => {
    let deps = [];
    for(let i = 0; i<jss.length; i++) {
      if(deps.indexOf(jss[i].departamento_nombre) == -1) {
        deps.push(jss[i].departamento_nombre)
      }
    }
    return { departaments: deps };
  },

  getDepsByProv: (prov, jss) => {
    let lss = []
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].provincia_nombre == prov && lss.indexOf(jss[i].departamento_nombre) == -1) {
        lss.push(jss[i].departamento_nombre);
      }
    }
    return { 
      deps: lss,
      length: lss.length
    };
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
    return {totalDengue};
  },

  getTotalZika: (jss) => {
    let totalZika = 0;
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].evento_nombre == 'Enfermedad por Virus del Zika') {
        totalZika += Number(jss[i].cantidad_casos);
      }
    }
    return {totalZika};
  },

};