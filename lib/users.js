const format = require("string-template");
const request = require('request');
const Rx = require('rx');

const userDelegate = {
  usedUserCache : [],
  userCache : [],
  channelInfo : { channelId : '', channelInfoURLTemplate : ''},
  userInfo : {userInfoUrlTemplate : ''},
  loadConfig : function(config){
    this.channelInfo.channelId = config.channelId;
    this.channelInfo.channelInfoURLTemplate = config.channelInfoURL;
    this.userInfo.userInfoUrlTemplate = config.userInfoURL;
  },
  loadUsersFromChannel : function(callback){
    const token = process.env.SLACK_TOKN;
    const rxRequest = Rx.Observable.fromNodeCallback(request);
    const this_ = this;

    console.log("Loading users...");
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
