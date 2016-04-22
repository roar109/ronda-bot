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
    console.log("Selecting start time...");
  },
  assignExercise : function(excercise, UserDelegate){
      console.log("Assigning a excercise...");
  }
};

module.exports.ExerciseHandler = exerciseHandler;
