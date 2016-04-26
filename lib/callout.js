const format = require("string-template");
const request = require('request');

const callout = {
  debug : true,
  channelId : null,
  botName : null,
  postMessageURLTemplate: null,
  loadConfig : function(config){
    if(!process.env.SLACK_TOKN){
      throw Error("SLACK_TOKN is missing");
    }
    this.debug = config.debug;
    this.botName = config.botName;
    this.channelId = config.channelId;
    this.postMessageURLTemplate = config.sendMessageSlackURL;

    if(this.debug){
      console.log("** Debug mode is on **");
    }
  },
  call : function(message){
    console.log(message);
    if(!this.debug){
      this.postMessage(message);
    }
  },
  exerciseCall : function(excercise, users){
    var mess = excercise.repetitions + " "+excercise.units+" "+excercise.name+" RIGHT NOW! ";
    var separator = '';
    users.forEach(function(usr){
      mess = mess + separator+"@"+usr.name;
      separator = ', ';
    });
    console.log(mess);
    if(!this.debug){
      this.postMessage(mess);
    }
  },
  postMessage : function(message){
    var url = format(this.postMessageURLTemplate, {
      token : process.env.SLACK_TOKN,
      channelId : this.channelId,
      botName : this.botName,
      message : message
    });
    request.post(url);
  }
};


module.exports.CalloutHandler = callout;
