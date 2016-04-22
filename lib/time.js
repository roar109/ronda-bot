const moment = require('moment');

const timeHandler = {
  officeHoursConfig : {},
  loadConfig : function(config){
    this.officeHoursConfig = config.officeHours;
  },
  isWorkingTime : function(){
    if(!this.officeHoursConfig.on)
      return true;

    const open = moment().minute(0).hour(this.officeHoursConfig.begin);
    const close = moment().minute(0).hour(this.officeHoursConfig.end);

    if(moment().isBefore(close) && moment().isAfter(open)){
      return true;
    }

    return false;
  }
};

module.exports.TimeHandler = timeHandler;
