// Create Services class
class Services {
  isIn(elem, arr) {
    return arr.indexOf(elem) != -1;
  }

  // Returns a list of provinces
  getProvinces(jss) {
    let value = [];
    for (let i = 0; i < jss.length; i++) {
      if (!this.isIn(jss[i].provincia_nombre, value)) {
        value.push(jss[i].provincia_nombre);
      }
    }
    return { provinces: value };
  }

  // Returns an object with departaments like: { departaments: ['example', 'example2'] }
  getDeparts(jss) {
    let deps = [];
    for (let i = 0; i < jss.length; i++) {
      if (deps.indexOf(jss[i].departamento_nombre) == -1) {
        deps.push(jss[i].departamento_nombre);
      }
    }
    return { departaments: deps };
  }

  // Returns an object with deps by province and its length like: { deps: ['dep1', 'dep2' ], length: 2 }
  getDepsByProv(prov, jss) {
    let lss = [];
    for (let i = 0; i < jss.length; i++) {
      if (
        jss[i].provincia_nombre == prov &&
        lss.indexOf(jss[i].departamento_nombre) == -1
      ) {
        lss.push(jss[i].departamento_nombre);
      }
    }
    return {
      prov,
      deps: lss,
      length: lss.length,
    };
  }

  /*
    Given a jss it returns
    [{ provincia: 'Prov1', departamentos: ['dep1', 'dep2'] },
     { provincia: 'Prov2', departamentos: ['dep1', 'dep2'] }]
  */
  getDepsOfProvs(jss) {
    let provs = getProvinces(jss);
    let result = [];

    for (let i = 0; i < provs.length; i++) {
      let liss = getDepsByProv(provs[i], jss);
      result.push({ provincia: provs[i], departamentos: liss });
    }
    return result;
  }

/*
-- Example --
{
  "departamento_id":"999","departamento_nombre":"*sin dato*",
  "provincia_id":"06",
  "provincia_nombre":"Buenos Aires",
  "año":"2018",
  "semanas_epidemiologicas":"11",
  "evento_nombre":"Dengue",
  "grupo_edad_id":"10",
  "grupo_edad_desc":"De 45 a 64 años",
  "cantidad_casos":"1"
}
*/

  getTotalDengueByProv(prov, jss) {
    let totalDengueByProv = 0;
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].provincia_nombre === prov && jss[i].evento_nombre === 'Dengue') {
        totalDengueByProv = totalDengueByProv + parseInt(jss[i].cantidad_casos);
      }
    }

    return { totalDengueByProv }
  }

  getTotalZikaByProv(prov, jss) {
    let totalZikaByProv = 0;
    for(let i = 0; i<jss.length; i++) {
      if(jss[i].provincia_nombre === prov && jss[i].evento_nombre === 'Enfermedad por Virus del Zika') {
        totalZikaByProv = totalZikaByProv + parseInt(jss[i].cantidad_casos);
      }
    }
    return { totalZikaByProv }
  }


  /* Given a jss returns a list like
    [{ province: 'prov1', dengueCases: 88, zikaCases: 99 },
    { province: 'prov2', dengueCases: 18, zikaCases: 29 }]
  */
  getProvsWithDengueAndZikaCases(jss) {
    let provinces = this.getProvinces(jss);
    provinces = provinces.provinces;
    let provsList = [];

    for(let i = 0; i<provinces.length; i++) {
      let totalDengue = 0;
      let totalZika = 0;
      let provWithDengueAndZika = { provincia: '', totalDengue: 0, totalZika: 0 };      
      totalDengue = this.getTotalDengueByProv(provinces[i], jss);
      totalZika = this.getTotalZikaByProv(provinces[i], jss);
      provWithDengueAndZika.provincia = provinces[i];
      provWithDengueAndZika.totalDengue = totalDengue.totalDengueByProv;
      provWithDengueAndZika.totalZika = totalZika.totalZikaByProv;
      provsList.push(provWithDengueAndZika);
    }
    return provsList;
  }

  getDengueAndZikaByDep(prov, jss) {
    let deps = [];
    let data = [];

    // list of deps ['dep1', 'dep2']
    deps = this.getDepsByProv(prov, jss).deps;

    // Count Dengue
    for(let i=0; i<deps.length; i++) {
      let dengueCases = 0;
      let zikaCases = 0;

      for(let j=0; j<jss.length; j++) {
        if(jss[j].departamento_nombre == deps[i] && jss[j].provincia_nombre == prov
            && jss[j].evento_nombre == 'Dengue') {
            dengueCases = dengueCases + Number(jss[j].cantidad_casos);
        } else if(jss[j].departamento_nombre == deps[i] && jss[j].provincia_nombre == prov
            && jss[j].evento_nombre == 'Enfermedad por Virus del Zika') {
            zikaCases = zikaCases + Number(jss[j].cantidad_casos)
          }
      }

      data.push({ dep: deps[i], dengueCases, zikaCases })
    }

    return { prov, data }
  }

  /* Returns the total sum of Dengue cases */
  getTotalDengue(jss) {
    let totalDengue = 0;
    for (let i = 0; i < jss.length; i++) {
      if (jss[i].evento_nombre === 'Dengue') {
        totalDengue = totalDengue + Number(jss[i].cantidad_casos);
      }
    }
    return { totalDengue };
  }

  /* Return the total sum of Zika cases */
  getTotalZika(jss) {
    let totalZika = 0;
    for (let i = 0; i < jss.length; i++) {
      if (jss[i].evento_nombre == 'Enfermedad por Virus del Zika') {
        totalZika += Number(jss[i].cantidad_casos);
      }
    }
    return { totalZika };
  }
}

module.exports = Services;
