// Create Services class
class Services {
  #isIn(elem, arr) {
    return arr.indexOf(elem) != -1;
  }

  // Returns a list of provinces
  getProvinces(jss) {
    let value = [];
    for (let i = 0; i < jss.length; i++) {
      if (!isIn(jss[i].provincia_nombre, value)) {
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

  // Returns an object with deps by province and its length like: { deps: ['prov1', 'prov2' ], length: 2 }
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

  /* Given a jss returns a list like
    [{ province: 'prov1', dengueCases: 88, zikaCases: 99 },
    { province: 'prov2', dengueCases: 18, zikaCases: 29 }]
  */
  getProvsWithDengueAndZikaCases = (jss) => {
    let provinces = this.getProvinces(jss);

    for(let i = 0; i<provinces.length; i++) {
      // Declare before...
    }
  }

  getTotalDengueByProv = (prov, jss) => {
    /* */
  }

  getTotalZikaByProv = (prov, jss) => {
    /* */
  }

  /* Returns the total sum of Dengue cases */
  getTotalDengue(jss) {
    let totalDengue = 0;
    let result = 0;
    for (let i = 0; i < jss.length; i++) {
      if (jss[i].evento_nombre == 'Dengue') {
        totalDengue += Number(jss[i].cantidad_casos);
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
