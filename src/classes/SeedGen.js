import SeedGenerator from "./SeedGenerator.js";

let seedValueURL = location.search;

    if(seedValueURL.length != 0){                   //SEED PASSADA NA URL
      let aux = "?seed=";
      seedValueURL = seedValueURL.substring(aux.length, seedValueURL.length);
      seedValueURL = parseInt(seedValueURL);
    }
    else{                                           //SEED ALEATÓRIA
      let maxValue = 5000000;
      let minValue = 500000;
      seedValueURL = (Math.floor(Math.random() * (maxValue - minValue)) + minValue);
    }
const seedGen = new SeedGenerator(seedValueURL.toString() , "sfc32");

export default seedGen;