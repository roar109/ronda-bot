const format = require("string-template");
const request = require('request');
const Rx = require('rx');

const userDelegate = {
  usedUserCache : [],
  userCache : [],
  channelInfo : { channelId : '', channelInfoURLTemplate : ''},
  userInfo : {userInfoUrlTemplate : ''},
  calloutsInfo : {},
  loadConfig : function(config){
    if(!process.env.SLACK_TOKN){
      throw Error("SLACK_TOKN is missing");
    }
    this.channelInfo.channelId = config.channelId;
    this.channelInfo.channelInfoURLTemplate = config.channelInfoURL;
    this.userInfo.userInfoUrlTemplate = config.userInfoURL;
    this.calloutsInfo.groupCalloutChance = config.callouts.groupCalloutChance;
    this.calloutsInfo.numPeople = config.callouts.numPeople;
  },
  getUsersForExcercise : function(){
    var assignedExcercise = new Array();
    //Get users or a group chance
    if(Math.random() < this.calloutsInfo.groupCalloutChance){
      console.log("Channel get ready");
      assignedExcercise.push({name:"@channel"});
    }else{
      //Get N users from userCache
      console.log("Getting "+this.calloutsInfo.numPeople + " people");
      assignedExcercise = this.getRandomUsers(this.calloutsInfo.numPeople);
    }

    return assignedExcercise;
  },
  getRandomUsers : function(howMany){
    var users = new Array();
    for(i = 0; i<howMany;i++){
      var user = this.userCache[Math.floor(Math.random() * this.userCache.length)];
      users.push({name: user.user.name,id:user.user.id});
    }
    return users;
  },
  loadUsersFromChannel : function(callback){
    const token = process.env.SLACK_TOKN;
    const rxRequest = Rx.Observable.fromNodeCallback(request);
    const this_ = this;

    //TODO validate env vars
    Rx.Observable.just(this.channelInfo.channelId)
    //Creates the channel info url
    .flatMap(id => Rx.Observable.just(
      format(this.channelInfo.channelInfoURLTemplate,{
        token : token,
        channelId : id
      })
    ))
    //Search for the channel info
    .flatMap(url => rxRequest(url))
    .flatMap(resp => JSON.parse(resp[1]).channel.members)
    //Creates user info URL
    .flatMap(userId => Rx.Observable.just(
      format(this.userInfo.userInfoUrlTemplate, {
        token : token,
        userId : userId
      }))
    )
    //Load user info for each user in the stream
    .flatMap(url => rxRequest(url))
    .map(resp => JSON.parse(resp[1]))
    //Filter only active
    .filter(function (x, idx, obs) {
      return x.ok == true && x.user.is_bot == false
        && x.user.deleted == false;
    })
    .subscribe(
      function(x){this_.userCache.push(x);},
      function(x){console.log(x);},
      function(x){if(callback){callback();}}
    );
  }
};

module.exports.UserDelegate = userDelegate;
