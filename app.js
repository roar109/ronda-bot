const config = require('./lib/configuration').config;
const UserDelegate = require('./lib/users').UserDelegate;
const TimeHandler = require('./lib/time').TimeHandler;
const ExerciseHandler = require('./lib/excercise').ExerciseHandler;
const CalloutHandler = require('./lib/callout').CalloutHandler;

TimeHandler.loadConfig(config);
UserDelegate.loadConfig(config);
ExerciseHandler.loadConfig(config);
CalloutHandler.loadConfig(config);
ExerciseHandler.addCalloutHandler(CalloutHandler);

UserDelegate.loadUsersFromChannel(function(){
  console.log("Loaded "+UserDelegate.userCache.length+" users from channel");
  main();
});

function main(){
  if(TimeHandler.isWorkingTime()){
    console.log("Working Time");
    ExerciseHandler.callAssignExcercise = function(excercise){
        ExerciseHandler.assignExercise(excercise, UserDelegate);
        setTimeout(main,0);
    };
    ExerciseHandler.selectExerciseAndStartTime();
  }else{
    console.log("No working Time, waiting 5 min...");
    setTimeout(main, 1000*60*5);
  }
}
