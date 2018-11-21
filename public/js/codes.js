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

var getDepsByProv_ = (prov) => {
  let provs = [];
  provs = getDepsByProv(prov, jsonData);
  return provs;
}

