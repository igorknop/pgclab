AudioLibrary = function(){
  this.MAX_CANAIS = 10;
  this.audios = {};
  this.canais = [];
  this.loaded = 0;
  this.size = 0;

  for (let i = 0; i < this.MAX_CANAIS; i++) {
    this.canais[i] = {
      audio: new Audio(),
      fim: -1
    }
  }
};

AudioLibrary.prototype.load = function (key, url) {
  this.audios[key] = new Audio();
  this.audios[key].src = url;
  this.size++;
  that = this;
  this.audios[key].addEventListener('canplaythrough', function(){
    that.loaded++;
    console.log(key, "terminou de carregar:", that.loaded, that.size);
  });
  this.audios[key].load();
};

AudioLibrary.prototype.play = function (key) {
  const agora = new Date();
  for (let i = 0; i < this.canais.length; i++) {
    const canal = this.canais[i];
    if(canal.fim < agora.getTime()){
      canal.audio.src = this.audios[key].src;
      canal.fim = agora.getTime()+this.audios[key].duration*1000;
      canal.audio.play();
      //console.log(agora.getTime(), this.audios[key].duration,canal.fim);
      break;
    }
  }
};

AudioLibrary.prototype.pause = function (key) {
  for (let i = 0; i < this.canais.length; i++) {
    const canal = this.canais[i];
    if(canal.audio.src == this.audios[key].src){
      canal.audio.pause();
      //console.log("Pausou: "+ canal.audio.currentTime);
      break;
    }
  }
};

AudioLibrary.prototype.resume = function (key) {
  for (let i = 0; i < this.canais.length; i++) {
    const canal = this.canais[i];
    if(canal.audio.src == this.audios[key].src){
      canal.audio.play();
      //console.log("Voltou: "+ canal.audio.currentTime);
      break;
    }
  }
};

AudioLibrary.prototype.isPaused = function (key) {         //retorna se o audio está pausado
  for (let i = 0; i < this.canais.length; i++) {
    const canal = this.canais[i];
    if(canal.audio.src == this.audios[key].src){
      if(canal.audio.paused){
        return true;
      }
      return false;
    }
  }
  return true;                                            //Audio não foi iniciado
};

AudioLibrary.prototype.stop = function (key) {            //parar de executar o áudio removendo do canal
  for (let i = 0; i < this.canais.length; i++) {
    if(this.canais[i].audio.src == this.audios[key].src){
      this.canais[i].audio.pause();
      this.canais[i] = {
        audio: new Audio(),
        fim: -1
      };
      break;
    }
  }
  return true;                                          //Audio não foi iniciado
};

AudioLibrary.prototype.isEnded = function (key) {       //Se o audio terminou de ser executado
  for (let i = 0; i < this.canais.length; i++) {
    const canal = this.canais[i];
    if(canal.audio.src == this.audios[key].src){
      if(canal.audio.ended){
        return true;
      }
      return false;
    }
  }
  return true;                                            //Audio não foi iniciado
};

AudioLibrary.prototype.isPlaying = function(key){
  if(this.currentTime(key) > 0 && this.currentTime(key) < this.duration(key)){
    return true;
  }
  return false;
}

AudioLibrary.prototype.duration = function (key) {        //tempo de duração do audio
  return this.audios[key].duration;
};

AudioLibrary.prototype.currentTime = function (key) {      //tempo até onde o audio foi executado
  for (let i = 0; i < this.canais.length; i++) {
    if(this.canais[i].audio.src == this.audios[key].src){
      return this.canais[i].audio.currentTime;
    }
  }
};
