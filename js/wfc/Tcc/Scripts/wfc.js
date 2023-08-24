

// class WFC {
//   // É responsável por executar o WFC
//   constructor({pesos,regras}){
//     this.pesos = pesos;
//     this.regras = regras;
//     this.onda = {};
//     this.frenteDeOnda = {};
//     this.n_padroes = pesos.length;
//   }
//
//   coord(k){
//     //recebe coordenadas com "2,2" e devolve em forma de array
//     return k.split(",").map(x=>parseInt(x))
//   }
//
//   entropia(x){
//     var total = 0
//     for (var i = 0; i < x.length; i++){
//       total += x[i]*this.pesos[i] //decobre o valor de 100%
//     }
//     var S = 0
//     for (var i = 0; i < x.length; i++){
//       var chanceElemento = x[i]*this.pesos[i]/total //verifica a chance daquele elemento
//       if (chanceElemento != 0){
//         S -= chanceElemento*Math.log(chanceElemento)
//       }
//     }
//     return S
//   }
//
//   collapse(x){
//    var total = 0
//    for (var i = 0; i < x.length; i++){
//      total += x[i]*this.pesos[i] //decobre o valor de 100%
//    }
//    var r = Math.random()*total //escolhe um elemento
//    for (var i = 0; i < x.length; i++){
//      r -= x[i]*this.pesos[i] //vai subtraindo ate chegar no elemento
//      if (r < 0){
//        var y = new Array(x.length).fill(0) // marca todos as possibilidades como falsas
//        y[i] = 1 // Marca a possibilidade escolhida com verdadeira
//        return y
//      }
//    }
//  }
//
//   neighborable(d,a,b){
//      // checa vizinhaca
//     var direcao = d.indexOf(1)
//     if (direcao < 0){
//       direcao = d.indexOf(-1)
//       ;[a,b] = [b,a]
//     }
//     for (var i = 0; i < this.regras.length; i++){
//       if (direcao == this.regras[i][0] || "yxz"[direcao] == this.regras[i][0]){
//         if (a == this.regras[i][1] && b == this.regras[i][2]){
//           return true
//         }
//       }
//     }
//     return false
//   }
//
//   propagate(coordenadas){
//     //propaga as mudancas
//     var stack = [coordenadas]
//
//     while (stack.length){
//       var coordenada = stack.pop();
//
//       var direcao = []
//       for (var i = 0; i < 2; i++){
//         var d0 = new Array(2).fill(0)
//         d0[i] = -1
//         direcao.push(d0)
//
//         var d1 = new Array(2).fill(0)
//         d1[i] = 1
//         direcao.push(d1)
//       }
//       for (var i = 0; i < direcao.length; i++){
//         var q = []
//         for (var j = 0; j < coordenadas.length; j++){
//           q.push(coordenadas[j]+direcao[i][j])
//         }
//         var x = this.frenteDeOnda[coordenadas]; if (x == undefined) {x = this.onda[coordenadas]}
//         var y = this.frenteDeOnda[q]; if (x == undefined) {x = this.onda[q]}
//
//         if (typeof y == 'number' || typeof y == 'undefined'){
//           continue
//
//         }else if (typeof x == 'number' && typeof y == 'object'){
//
//           var mod = false
//           for (var j = 0; j < y.length; j++){
//             if (y[j] == 0){
//               continue
//             }
//             if (y[j] > 0 && !this.neighborable(direcao[i],x,j)){
//               y[j] = 0
//               mod = true
//             }
//           }
//           if (mod){
//             stack.push(q);
//           }
//
//         }else if (typeof x == 'object' && typeof y == 'object'){
//           var mod = false
//           for (var j = 0; j < y.length; j++){
//             if (y[j] == 0){
//               continue
//             }
//             var ok = false
//             for (var k = 0; k < x.length; k++){
//               if (x[k] > 0 && y[j] > 0 && this.neighborable(direcao[i],k,j)){
//                 ok = true
//                 break
//               }
//             }
//             if (!ok){
//               y[j] = 0
//               mod = true
//             }
//           }
//           if (mod){
//             stack.push(q)
//           }
//
//         }else{
//           throw Error("Invalid propagation parameter",x,y);
//         }
//
//       }
//     }
//   }
//
//
//     argmax(vals){
//       //retorna o o index do maior numero no array
//       var mi = -1;
//       var mv = -Infinity;
//       for (var i = 0; i < vals.length; i++){
//         if (vals[i] > mv){
//           mv = vals[i]
//           mi = i
//         }
//       }
//       return mi
//     }
//
//      readout(collapse=true){
//       if (!collapse){
//         var result = {}
//         for (var k in this.onda){
//           var oh = Array(this.n_padroes).fill(0);
//           oh[this.onda[k]] = 1;
//           result[k] = oh;
//         }
//         for (var k in this.frenteDeOnda){
//           var s = this.frenteDeOnda[k].reduce((a,b) => a + b, 0)
//           var oh = this.frenteDeOnda[k].map(x=>(s==0?0:x/s));
//           result[k] = oh;
//         }
//         return result;
//       }
//
//       var result = {}
//       for (var k in this.frenteDeOnda){
//         if (this.frenteDeOnda[k].reduce((a,b) => a + b, 0) == 1){
//           result[k] = this.argmax(this.frenteDeOnda[k])
//         }
//       }
//       return Object.assign({},this.onda,result)
//     }
//
//     expand(xmin, xmax){
//       var coords = [[0]]
//       for (var i = 0; i < xmin.length; i++){
//         var cc = []
//         for (var x = xmin[i]; x < xmax[i]; x++){
//           var c = []
//           for (var j = 0; j < coords.length; j++){
//             c.push(coords[j].concat(x))
//           }
//           cc = cc.concat(c)
//         }
//         coords = cc;
//       }
//       coords = coords.map(x=>x.slice(1)).filter(x=>!(x in this.onda || x in this.frenteDeOnda))
//
//       coords.map(x=>this.frenteDeOnda[x]=new Array(this.n_padroes).fill(1))
//       for (var k in this.onda){
//         this.propagate(this.coord(k))
//       }
//     }
//
//     step(){
//       var min_ent = Infinity
//       var min_arg = undefined
//
//       for (var k in this.frenteDeOnda){
//         var ent = this.entropia(this.frenteDeOnda[k])
//         if (isNaN(ent)){
//           for (var k in this.frenteDeOnda){
//             this.frenteDeOnda[k]=new Array(this.n_padroes).fill(1)
//           }
//           for (var k in this.onda){
//             this.propagate(this.coord(k))
//           }
//           //console.log(":(")
//           return false
//         }
//         if (ent == 0){
//           continue;
//         }
//         ent += (Math.random()-0.5)
//         if (ent < min_ent){
//           min_ent = ent
//           min_arg = this.coord(k)
//         }
//       }
//
//       if (min_ent == Infinity){
//         this.onda = this.readout();
//         this.frenteDeOnda = {};
//         return true;
//       }
//       this.frenteDeOnda[min_arg] = this.collapse(this.frenteDeOnda[min_arg]);
//       this.propagate(min_arg);
//       return false;
//     }
// }

var WFC = function({pesos,regras}){

  wave = {};
  var wavefront = {}
  var n_padroes = pesos.length
  var wavefront = {}
  var seedWFC;

  let seedValueURL = location.search;
  if(seedValueURL.length != 0){                   //SEED PASSADA NA URL
    let aux = "?seed=";
    seedValueURL = seedValueURL.substring(aux.length, seedValueURL.length);
    seedWFC = parseInt(seedValueURL);
  }else{
    seedWFC = Math.random()*100000000000
  }

  this.getOnda = function(){
    return wave;
  }

  function random() {
    var x = Math.sin(seedWFC++) * 10000;
    return x - Math.floor(x);
  }

  function coord(k){
    return k.split(",").map(x=>parseInt(x))
  }

  function entropia(x){
    var one = 0
    for (var i = 0; i < x.length; i++){
      one += x[i]*pesos[i]
    }
    var S = 0
    for (var i = 0; i < x.length; i++){
      var pi = x[i]*pesos[i]/one
      if (pi != 0){
        S -= pi*Math.log(pi)
      }
    }
    return S
  }


   function collapse(x){
    var one = 0
    for (var i = 0; i < x.length; i++){
      one += x[i]*pesos[i]
    }
    var r = random()*one
    for (var i = 0; i < x.length; i++){
      r -= x[i]*pesos[i]
      if (r < 0){
        var y = new Array(x.length).fill(0)
        y[i] = 1
        return y
      }
    }
  }

   function neighborable(d,a,b){
     //debugger;
    var didx = d.indexOf(1)
    if (didx < 0){
      didx = d.indexOf(-1)
      ;[a,b] = [b,a]
    }
    for (var i = 0; i < regras.length; i++){
      if (didx == regras[i][0] || "yxz"[didx] == regras[i][0]){
        if (a == regras[i][1] && b == regras[i][2]){
          return true
        }
      }
    }
    return false
  }

    function propagate(p){
    var stack = [p]

    while (stack.length){
      p = stack.pop()

      var dirs = []
      for (var i = 0; i < 2; i++){
        var d0 = new Array(2).fill(0)
        d0[i] = -1
        dirs.push(d0)

        var d1 = new Array(2).fill(0)
        d1[i] = 1
        dirs.push(d1)
      }
      for (var i = 0; i < dirs.length; i++){
        var q = []
        for (var j = 0; j < p.length; j++){
          q.push(p[j]+dirs[i][j])
        }
        var x = wavefront[p]; if (x == undefined) {x = wave[p]}
        var y = wavefront[q]; if (x == undefined) {x = wave[q]}

        if (typeof y == 'number' || typeof y == 'undefined'){
          continue

        }else if (typeof x == 'number' && typeof y == 'object'){

          var mod = false
          for (var j = 0; j < y.length; j++){
            if (y[j] == 0){
              continue
            }
            if (y[j] > 0 && !neighborable(dirs[i],x,j)){
              y[j] = 0
              mod = true
            }
          }
          if (mod){
            stack.push(q);
          }

        }else if (typeof x == 'object' && typeof y == 'object'){
          var mod = false
          for (var j = 0; j < y.length; j++){
            if (y[j] == 0){
              continue
            }
            var ok = false
            for (var k = 0; k < x.length; k++){
              if (x[k] > 0 && y[j] > 0 && neighborable(dirs[i],k,j)){
                ok = true
                break
              }
            }
            if (!ok){
              y[j] = 0
              mod = true
            }
          }
          if (mod){
            stack.push(q)
          }

        }else{
          throw Error("Invalid propagation parameter",x,y);
        }

      }
    }
  }


   function argmax(vals){
    var mi = -1;
    var mv = -Infinity;
    for (var i = 0; i < vals.length; i++){
      if (vals[i] > mv){
        mv = vals[i]
        mi = i
      }
    }
    return mi
  }

   this.readout = function(collapse=true){
    if (!collapse){
      var result = {}
      for (var k in wave){
        var oh = Array(n_padroes).fill(0);
        oh[wave[k]] = 1;
        result[k] = oh;
      }
      for (var k in wavefront){
        var s = wavefront[k].reduce((a,b) => a + b, 0)
        var oh = wavefront[k].map(x=>(s==0?0:x/s));
        result[k] = oh;
      }
      return result;
    }

    var result = {}
    for (var k in wavefront){
      if (wavefront[k].reduce((a,b) => a + b, 0) == 1){
        result[k] = argmax(wavefront[k])
      }
    }
    return Object.assign({},wave,result)
  }

  this.expand = function(xmin, xmax){
    var coords = [[0]]
    for (var i = 0; i < xmin.length; i++){
      var cc = []
      for (var x = xmin[i]; x < xmax[i]; x++){
        var c = []
        for (var j = 0; j < coords.length; j++){
          c.push(coords[j].concat(x))
        }
        cc = cc.concat(c)
      }
      coords = cc;
    }
    coords = coords.map(x=>x.slice(1)).filter(x=>!(x in wave || x in wavefront))

    coords.map(x=>wavefront[x]=new Array(n_padroes).fill(1))
    for (var k in wave){
      propagate(coord(k))
    }
  }

  this.step = function(){
    var min_ent = Infinity
    var min_arg = undefined

    for (var k in wavefront){
      var ent = entropia(wavefront[k])
      if (isNaN(ent)){
        for (var k in wavefront){
          wavefront[k]=new Array(n_padroes).fill(1)
        }
        for (var k in wave){
          propagate(coord(k))
        }
        console.log(":(")
        return false
      }
      if (ent == 0){
        continue;
      }
      ent += (random()-0.5)
      if (ent < min_ent){
        min_ent = ent
        min_arg = coord(k)
      }
    }

    if (min_ent == Infinity){
      wave = this.readout();
      wavefront = {};
      return true;
    }
    wavefront[min_arg] = collapse(wavefront[min_arg]);
    propagate(min_arg);
    return false;
  }



}
