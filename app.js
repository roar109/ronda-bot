const config = require('./lib/configuration').config;
const UserDelegate = require('./lib/users').UserDelegate;
const TimeHandler = require('./lib/time').TimeHandler;
const ExerciseHandler = require('./lib/excercise').ExerciseHandler;

TimeHandler.loadConfig(config);
UserDelegate.loadConfig(config);
ExerciseHandler.loadConfig(config);

UserDelegate.loadUsersFromChannel(function(){
  console.log("Loaded "+UserDelegate.userCache.length+" users");
  main();
});

function main(){
  if(TimeHandler.isWorkingTime()){
    console.log("Working Time");
    const excercise = ExerciseHandler.selectExerciseAndStartTime();
    ExerciseHandler.assignExercise(excercise, UserDelegate);
  }else{
    console.log("No working Time, waiting 5 min...");
    setTimeout(main, 1000*60*5);
  }
}
