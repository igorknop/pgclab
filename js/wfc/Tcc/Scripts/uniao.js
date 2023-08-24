var tilesets = {
labirinto: function(tool){

tool.addTile(`\
2222
2222
2222
2222`,{weight:1})

tool.addTile(`\
0000
0000
0000
0000`)

tool.addTile(`\
0012
0012
0012
0012`)

tool.addTile(`\
2222
1112
0012
0012`)

tool.addTile(`\
2210
2210
1110
0000`)

tool.addColor("0", [244,164,96])
tool.addColor("1", [139,69,19])
tool.addColor("2", [139,69,19])
},


salas: function(tool){

tool.addTile(`\
@@@
@@@
@@@`,{weight:5})

tool.addTile(`\
...
...
...`)

tool.addTile(`\
@@@
...
...`)


tool.addTile(`\
..@
...
...`)



tool.addColor("@", [255,255,255])
tool.addColor(".", [0,0,0])

},

}

var tool = new ferramentaWfc();
tilesets["labirinto"](tool);
var tamanho = 30
wfcInput = tool.generateWFCInput();
wfc = new WFC(wfcInput);
wfc.step();
wfc.expand([0,0],[tamanho,tamanho])
var tentativas = 0;
console.log("start");
while(!wfc.step()){
  tentativas++;
  //console.log("creating");
  if(tentativas>100000){
    console.log("fail");
    break;
  }
};

wfc.onda = wfc.getOnda();
tool.tiles = tool.getTiles();

var arrayform = [];

for(var i = 0; i<tamanho;i++){

  for(var k = 0; k<tool.tiles[0].length; k++){
    arrayform.push([]);
  }
  for(var j = 0; j<tamanho;j++){
    var tile = wfc.onda[i+","+j];
    for(var k = 0; k<tool.tiles[0].length; k++){
      for(var l = 0; l<tool.tiles[0].length; l++){
        arrayform[(4*i)+k].push(tool.tiles[tile][k][l]);
      }
    }
  }
}
//console.log(arrayform);
