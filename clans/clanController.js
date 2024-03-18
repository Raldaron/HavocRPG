var app = angular.module("site");

app.controller("raceController",
 ['$scope', 'UglyService', 'TermIndexService', 'raceService', 'DisciplineService',
 function($scope, UglyService, TermIndexService, raceService, DisciplineService) {

    this.racePage = "./races/race.html";
    this.filterraces = filterraces;

    this.raceFilters = getraceFilters();
    function getraceFilters(){
      return raceService.raceFilters;
    }

    this.setrace = setrace;
    function setrace(charrace){
      raceService.selectedrace = charrace;
    }

    this.raceList = getraceList();
    function getraceList(){
      return raceService.raceList;
    }

    this.selectedrace = getSelectedrace();
    function getSelectedrace(){
      return raceService.selectedrace;
    }

    this.selectedraceFilter = getSelectedraceFilter();
    function getSelectedraceFilter(){
      return raceService.selectedraceFilter;
    }

    this.filteredraceList = getFilteredraceList();
    function getFilteredraceList(){
      return raceService.filteredraceList;
    }

    function filterraces(filter){
      this.filteredraceList = raceService.filterraces(filter);
      this.selectedrace = this.filteredraceList[0];
    }

    $scope.setUrace = setUrace;
    this.setUrace = setUrace;

    function setUrace(race) {
      UglyService.setrace(race);
      DisciplineService.setrace(race);
    }

    $scope.setTerm = function(term) {
      TermIndexService.setTerm(term);
    }

    var self = this;
    $scope.$on('loadCharacter', function(){
      self.selectedrace = raceService.selectedrace;
      $scope.$apply();
    });

    //SHOULD RESET race & DISCIPLINE SECTIONS
    $scope.$on('resetCharacter', function(){
      self.setUrace(raceService.raceList[0]);
    })

  }
]);
