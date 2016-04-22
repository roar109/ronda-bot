const exerciseHandler = {
  excerciseCache : [],
  excercises : [],
  callouts : {},
  loadConfig : function(config){
    this.excercises = config.exercises;
    this.callouts = config.callouts;
  },
  selectExerciseAndStartTime : function(){
    console.log("Selecting an excercise...");
    this.getExcercise();
  },
  assignExercise : function(excercise, UserDelegate, CalloutHandler){
      console.log("Assigning a excercise...");
      console.log("Excercise:");
      console.log(excercise);
      //Get random user and send the message
  },
  getExcercise : function(callback){
    searchInCache(this.getRandomExcercise(), this.excerciseCache, this.selectStartTime);
  },
  getRandomExcercise : function(){
    return this.excercises[Math.floor(Math.random() * this.excercises.length)];
  },
  selectStartTime : function(excercise){
    console.log("Selecting start time...");
    var minutes = exerciseHandler.getRandomTimeFromWindow();
    minutes = Math.floor(minutes);
    console.log("Minutes: "+minutes);
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

function searchInCache(excer, cache, callback){
  var found = false;

  if(cache.length == exerciseHandler.excercises){
    console.log('All done reseting');
    cache.length = 0;
  }

  cache.forEach(function(ex){
    if(ex.id == excer.id){
      console.log('Found '+ex.id);
      found = true;
    }
  });

  if(found){
    searchInCache(exerciseHandler.getRandomExcercise(), cache);
  }else{
    cache.push(excer);
    callback(excer);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.ExerciseHandler = exerciseHandler;
