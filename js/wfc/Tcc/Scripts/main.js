
var tilesets = {
labirinto: function(tool){
  
tool.addTile(`\
@@@
@@@
@@@`,{weight:4})

tool.addTile(`\
@@@
@d@
@@@`)

tool.addTile(`\
...
...
...`)

tool.addTile(`\
..@
..@
..@`)

tool.addTile(`\
@@@
..@
..@`)
  
tool.addTile(`\
@..
...
...`)

tool.addColor("@", [244,164,96])
tool.addColor(".", [139,69,19])
tool.addColor("d", [0,255,0])
  
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


var worker;
var canvas;
var scene;
var camera;
var renderer;
var root;

function wfcDemo(tilesetName){
  
  if (worker){
    worker.terminate();
  }
  
  var tool = new ferramentaWfc();
  
  tilesets[tilesetName](tool);
  
  var viewport;
  var wave;

  var workerCode = function(){
    var viewport;
    var wfc;
    var aspectRatio;
    var size;
    var increment;
    var multiply;

    console.log("connect")

    onmessage = function(e) {
      console.log(e)
      if (e.data.op == "init"){
        wfc = new WFC(e.data.wfcInput);
        aspectRatio = e.data.aspectRatio;
        size = e.data.initialSize;
        increment = e.data.increment;
        multiply = e.data.multiply
        main();
      }
    }

    function main(){
      setTimeout(main,1);
      if (!wfc){
        return
      }
      if (wfc.step()){
        viewport = {x:-size,y:-Math.round(size*aspectRatio),w:size*2,h:Math.round(size*2*aspectRatio)}
        wfc.expand([viewport.y,viewport.x],[viewport.y+viewport.h,viewport.x+viewport.w]);
        size=Math.ceil((size+increment)*multiply);
      }
      postMessage({viewport,wave:wfc.readout(/*false*/)})
    }
  }

  console.log(tool.getTileFormulae())
  
  worker =new Worker(URL.createObjectURL(new Blob(["var WFC="+WFC.toString()+';('+workerCode.toString()+')()'])));// new Worker('worker.js');

  worker.postMessage({
    op:'init',
    wfcInput:tool.generateWFCInput(),
    aspectRatio:window.innerHeight/window.innerWidth,
    initialSize:8,
    increment:0,
    multiply:1.5,
  })

  worker.onmessage = function(e){
    viewport = e.data.viewport;
    wave = e.data.wave;
  }

  if (renderer){
    renderer.domElement.style.display="none";
  }
  
  if (!canvas){
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    document.body.appendChild(canvas);
  }else{
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  
  canvas.style.display="block";

  function main(){
    requestAnimationFrame(main)
    // tool.clearPlotCache();
    if (viewport && wave){
      tool.plotWFCOutput(canvas,viewport,wave)
    }
  }
  main();
}


var menubar = document.createElement("div");
var title = document.createElement("span"); menubar.appendChild(title);
title.innerHTML = "<b>NDWFC:</b> <i>Wave Function Collapse testing</i>"
title.style.display="inline-block";
title.style.marginTop="4px";
menubar.style.zIndex="1000"
menubar.style.position="absolute";
menubar.style.left="0px";
menubar.style.top="0px";
menubar.style.background="rgba(0,0,0,0.6)"
menubar.style.color="white";
menubar.style.padding="10px"
menubar.style.fontFamily="sans-serif";
menubar.style.width=window.innerWidth+"px";
menubar.style.fontSize="20px"

var selbox = document.createElement("span"); menubar.appendChild(selbox);
selbox.innerHTML = "Tileset = "
selbox.style.marginRight="30px";
selbox.style.float="right";
// selbox.style.border="1px solid rgba(255,255,255,0.8)";
selbox.style.padding="5px";
selbox.style.fontSize="16px"

var select = document.createElement("select");
for (var k in tilesets){
  var option = document.createElement("option");
  option.value = k;
  option.innerHTML = k;
  select.appendChild(option);
}

select.style.background="rgba(0,0,0,0)";
select.style.color="white"
select.style.fontSize="16px"
select.onchange = function(){
	wfcDemo(select.value);
}

selbox.appendChild(select);


document.body.appendChild(menubar)

select.value="labirinto"
wfcDemo('labirinto');