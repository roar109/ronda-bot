const exerciseHandler = {
  excerciseCache : [],
  excercises : [],
  callouts : {},
  loadConfig : function(config){
    this.excercises = config.exercises;
    this.callouts = config.callouts;
  },
  selectExerciseAndStartTime : function(){
    this.getExcercise();
  },
  assignExercise : function(excercise, UserDelegate){
      //Get random user and send the message
      var users = UserDelegate.getUsersForExcercise();
      users.forEach(function(us){
        console.log(us.name);
      });
      exerciseHandler.CalloutHandler.exerciseCall(excercise, users);
  },
  getExcercise : function(callback){
    searchInCache(this.getRandomExcercise(), this.selectStartTime);
  },
  getRandomExcercise : function(){
    return this.excercises[Math.floor(Math.random() * this.excercises.length)];
  },
  selectStartTime : function(excercise){
    var minutes = exerciseHandler.getRandomTimeFromWindow();
    minutes = Math.floor(minutes);

    //Get repetitions
    excercise.repetitions = getRandomInt(excercise.minReps,excercise.maxReps);

    exerciseHandler.CalloutHandler.call('Next lottery of '+excercise.name+' in '+minutes+' minutes');

    //Callout lotery next X minutes for excercise
    setTimeout(function(){
      exerciseHandler.callAssignExcercise(excercise);
    }, minutes*60*1000);

  },
  getRandomTimeFromWindow : function(){
    return getRandomInt(this.callouts.timeBetween.minTime, this.callouts.timeBetween.maxTime);
  },
  addCalloutHandler : function(calloutHandler){
    this.CalloutHandler = calloutHandler;
  }
};

function searchInCache(excer, callback){
  var found = false;

  if(exerciseHandler.excerciseCache.length == exerciseHandler.excercises.length){
    exerciseHandler.excerciseCache.length = 0;
  }

  exerciseHandler.excerciseCache.forEach(function(ex){
    if(ex.id == excer.id){
      found = true;
    }
  });

  if(found){
    searchInCache(exerciseHandler.getRandomExcercise(), callback);
  }else{
    exerciseHandler.excerciseCache.push(excer);
    callback(excer);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.ExerciseHandler = exerciseHandler;
