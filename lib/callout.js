const callout = {
  debug : true,
  loadConfig : function(config){
    this.debug = config.debug;
  },
  call : function(message){
    console.log(message);
    if(!this.debug){
      //send to slack
    }
  }
};


module.exports.CalloutHandler = callout;
