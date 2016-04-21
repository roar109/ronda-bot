const userDelegate = {
  usedUserCache : [],
  getUsersFromChannel : function(url, channelId){
    return new Array();
  },
  calloutPeople : function(amount){
    return new Array();
  }
};

const userModel = {

};

module.exports.UserDelegate = userDelegate;
module.exports.User = userModel;
