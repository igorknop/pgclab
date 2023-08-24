//
// class ferramentaWfc {
//   constructor(){
//     this.tiles = [];
//     this.colors = {};
//     this.pesos = [];
//     this.n_prototypes = 0;
//     this.formulae = [];
//
//     this.viewportCached = {x:0,y:0,w:-1,h:-1};
//     this.waveCached = {};
//
//     this.transformBank = {
//       cw:function(m){
//         var r = [];
//         for (var i = 0; i < m.length; i++){
//           r.push([])
//           for (var j = m.length-1; j >= 0; j--){
//             r[r.length-1].push(m[j][i]);
//           }
//         }
//         return r;
//       },
//
//       fx:function(m){
//         var r = [];
//         for (var i = 0; i < m.length; i++){
//           r.push([])
//           for (var j = m[0].length-1; j >= 0; j--){
//             r[r.length-1].push(m[i][j]);
//           }
//         }
//         return r;
//       },
//       fy:function(m){
//         var r = [];
//         for (var i = m.length-1; i >= 0; i--){
//           r.push([])
//           for (var j = 0; j < m[i].length; j++){
//             r[r.length-1].push(m[i][j]);
//           }
//         }
//         return r;
//       }
//     }
//   }
//
//   equal(m,r){
//     for (var i = 0; i < m.length; i++){
//       for (var j = 0; j < m[0].length; j++){
//         if (m[i][j] != r[i][j]){
//           return false;
//         }
//       }
//     }
//     return true;
//   }
//
//   fit(d,a,b){
//     if (d == "x"){
//       for (var i = 0; i < a.length; i++){
//         if (a[i][a[i].length-1] != b[i][0]){
//           return false;
//         }
//       }
//     }else if (d == "y"){
//       for (var i = 0; i < a[0].length; i++){
//         if (a[a.length-1][i] != b[0][i]){
//           return false;
//         }
//       }
//     }
//     return true;
//   }
//
//   addTile(s,{transforms="auto",weight=1}={}){
//     var t = s.split("\n").map(x=>x.split(""))
//     this.tiles.push(t);
//     this.formulae.push([ this.n_prototypes, '', t ])
//     this.pesos.push(weight)
//
//     var tests = []
//
//     if (transforms == "auto"){
//       transforms = ['cw','cw+cw','cw+cw+cw']
//     }
//
//     for (var i = 0; i < transforms.length; i++){
//       var tl = transforms[i].split("+")
//       var tt = t
//       for (var j = 0; j < tl.length; j++){
//         tt = this.transformBank[tl[j]](tt);
//       }
//       tests.push(tt);
//     }
//     for (var i = 0; i < tests.length; i++){
//       var ok = true;
//       for (var j = 0; j < this.tiles.length; j++){
//         if (this.equal(tests[i],this.tiles[j])){
//           ok = false;
//           break;
//         }
//       }
//       if (ok){
//         this.tiles.push(tests[i])
//         this.pesos.push(weight)
//         this.formulae.push([ this.n_prototypes, transforms[i], tests[i] ])
//       }
//     }
//     this.n_prototypes++;
//   }
//
//   addColor(symbol, color){
//     this.colors[symbol] = color;
//   }
//
//   getTileFormulae(){
//     return this.formulae;
//   }
//
//   generateWFCInput(){
//     var regras = []
//     for (var i = 0; i < this.tiles.length; i++){
//       for (var j = 0; j < this.tiles.length; j++){
//
//         if (this.fit("x",this.tiles[i],this.tiles[j])){
//           regras.push(['x',i,j])
//         }
//         if (this.fit("y",this.tiles[i],this.tiles[j])){
//           regras.push(['y',i,j])
//         }
//       }
//     }
//     var pesos = this.pesos;
//     return {pesos,regras};
//   }
//
//   clearPlotCache(){
//     this.waveCached = {};
//   }
//
//   plotWFCOutput(canvas,viewport,wave){
//     var ctx = canvas.getContext('2d');
//     var w = this.tiles[0][0].length
//     var h = this.tiles[0].length;
//
//     var cw = canvas.width/viewport.w
//     var ch = canvas.height/viewport.h
//
//     if (this.viewportCached.x != viewport.x || this.viewportCached.y != viewport.y || this.viewportCached.w != viewport.w || this.viewportCached.h != viewport.h){
//       console.log("no cache")
//       this.waveCached = {};
//       ctx.fillStyle = "black"
//       ctx.fillRect(0,0,canvas.width,canvas.height)
//     }
//     this.viewportCached = {x:viewport.x,y:viewport.y,w:viewport.w,h:viewport.h};
//
//     for (var k in wave){
//       if (k in this.waveCached){
//         continue
//       }
//       this.waveCached[k] = wave[k]
//       var [y,x] = k.split(",").map(x=>parseInt(x));
//       x = (x-viewport.x)/viewport.w*canvas.width
//       y = (y-viewport.y)/viewport.h*canvas.height
//
//       var v = wave[k];
//
//       for (var i = 0; i < h; i++){
//         for (var j = 0; j < w; j++){
//
//           var rgb = [0,0,0];
//           if (typeof v === 'number'){
//             rgb = this.colors[this.tiles[v][i][j]];
//           }else{
//             for (var ii = 0; ii < tiles.length; ii++){
//               rgb[0] += colors[this.tiles[ii][i][j]][0]*v[ii];
//               rgb[1] += colors[this.tiles[ii][i][j]][1]*v[ii];
//               rgb[2] += colors[this.tiles[ii][i][j]][2]*v[ii];
//             }
//             rgb = rgb.map(Math.round)
//           }
//           ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
//           ctx.fillRect(x+cw*j/w,y+ch*i/h,cw/w+1,ch/h+1);
//         }
//       }
//     }
//   }
//
// }










var ferramentaWfc = function(){
  var tiles = []
  var colors = {}
  var pesos = []
  var n_prototypes = 0
  var formulae = []


  var transformBank = {
    cw:function(m){
      var r = [];
      for (var i = 0; i < m.length; i++){
        r.push([])
        for (var j = m.length-1; j >= 0; j--){
          r[r.length-1].push(m[j][i]);
        }
      }
      return r;
    },

    fx:function(m){
      var r = [];
      for (var i = 0; i < m.length; i++){
        r.push([])
        for (var j = m[0].length-1; j >= 0; j--){
          r[r.length-1].push(m[i][j]);
        }
      }
      return r;
    },
    fy:function(m){
      var r = [];
      for (var i = m.length-1; i >= 0; i--){
        r.push([])
        for (var j = 0; j < m[i].length; j++){
          r[r.length-1].push(m[i][j]);
        }
      }
      return r;
    }
  }


  function equal(m,r){
    for (var i = 0; i < m.length; i++){
      for (var j = 0; j < m[0].length; j++){
        if (m[i][j] != r[i][j]){
          return false;
        }
      }
    }
    return true;
  }

  function fit(d,a,b){
    if (d == "x"){
      for (var i = 0; i < a.length; i++){
        if (a[i][a[i].length-1] != b[i][0]){
          return false;
        }
      }
    }else if (d == "y"){
      for (var i = 0; i < a[0].length; i++){
        if (a[a.length-1][i] != b[0][i]){
          return false;
        }
      }
    }
    return true;
  }

  this.addTile = function(s,{transforms="auto",weight=1}={}){
    var t = s.split("\n").map(x=>x.split(""))
    tiles.push(t);
    formulae.push([ n_prototypes, '', t ])
    pesos.push(weight)

    var tests = []

    if (transforms == "auto"){
      transforms = ['cw','cw+cw','cw+cw+cw']
    }

    for (var i = 0; i < transforms.length; i++){
      var tl = transforms[i].split("+")
      var tt = t
      for (var j = 0; j < tl.length; j++){
        tt = transformBank[tl[j]](tt);
      }
      tests.push(tt);
    }
    for (var i = 0; i < tests.length; i++){
      var ok = true;
      for (var j = 0; j < tiles.length; j++){
        if (equal(tests[i],tiles[j])){
          ok = false;
          break;
        }
      }
      if (ok){
        tiles.push(tests[i])
        pesos.push(weight)
        formulae.push([ n_prototypes, transforms[i], tests[i] ])
      }
    }
    n_prototypes++;
  }

  this.addColor = function(symbol, color){
    colors[symbol] = color
  }

  this.getTileFormulae = function(){
    return formulae;
  }

  this.generateWFCInput = function(){
    var regras = []
    for (var i = 0; i < tiles.length; i++){
      for (var j = 0; j < tiles.length; j++){

        if (fit("x",tiles[i],tiles[j])){
          regras.push(['x',i,j])
        }
        if (fit("y",tiles[i],tiles[j])){
          regras.push(['y',i,j])
        }
      }
    }
    return {pesos,regras}
  }

  var viewportCached = {x:0,y:0,w:-1,h:-1};
  var waveCached = {};

  this.clearPlotCache = function(){
    waveCached = {};
  }

  this.getTiles = function(){
    return tiles;
  }

  this.plotWFCOutput = function(canvas,viewport,wave){
    var ctx = canvas.getContext('2d');
    var w = tiles[0][0].length
    var h = tiles[0].length;

    var cw = canvas.width/viewport.w
    var ch = canvas.height/viewport.h

    if (viewportCached.x != viewport.x || viewportCached.y != viewport.y || viewportCached.w != viewport.w || viewportCached.h != viewport.h){
      console.log("no cache")
      waveCached = {};
      ctx.fillStyle = "black"
      ctx.fillRect(0,0,canvas.width,canvas.height)
    }
    viewportCached = {x:viewport.x,y:viewport.y,w:viewport.w,h:viewport.h};

    for (var k in wave){
      if (k in waveCached){
        continue
      }
      waveCached[k] = wave[k]
      var [y,x] = k.split(",").map(x=>parseInt(x));
      x = (x-viewport.x)/viewport.w*canvas.width
      y = (y-viewport.y)/viewport.h*canvas.height

      var v = wave[k];

      for (var i = 0; i < h; i++){
        for (var j = 0; j < w; j++){

          var rgb = [0,0,0];
          if (typeof v === 'number'){
            rgb = colors[tiles[v][i][j]];
          }else{
            for (var ii = 0; ii < tiles.length; ii++){
              rgb[0] += colors[tiles[ii][i][j]][0]*v[ii];
              rgb[1] += colors[tiles[ii][i][j]][1]*v[ii];
              rgb[2] += colors[tiles[ii][i][j]][2]*v[ii];
            }
            rgb = rgb.map(Math.round)
          }
          ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
          ctx.fillRect(x+cw*j/w,y+ch*i/h,cw/w+1,ch/h+1);
        }
      }
    }
  }

}
