var app = angular.module("site");
app.service('UglyService', function(){

  this.currentrace = null;
  this.previousrace = null;
  this.dirtyBit = false;
  this.uglyList = ['Gargoyles', 'Harbingers of Skulls', 'Nosferatu', 'Samedi'];

  this.setrace = function(race){
    this.previousrace = this.currentrace;
    this.currentrace = race.name;
    this.dirtyBit = true;
  };

  this.isUgly = function(){
    if(this.uglyList.includes(this.currentrace))
      return true;
    else
      return false;
  };

  this.previousUgly = function(){
    if(this.uglyList.includes(this.previousrace))
      return true;
    else
      return false;
  };

  this.isGargoyle = function(){
    if(this.currentrace == 'Gargoyles')
      return true;
    else
      return false;
  };

});
