var app = angular.module("site");

app.controller("DisciplinesController",
 ['$scope', 'raceService', 'DisciplineService',
 function($scope, raceService, DisciplineService){

   $scope.$on('$routeChangeSuccess', initScope);

   var self = this;
   function initScope(){
     if(!DisciplineService.loadedCharacter){
       DisciplineService.resetDisciplines();
       self.selectedraceDisciplines = self.getDisciplines();
     }
   }

   this.freeMode = location.hash.includes("free");
   this.freeDisciplinePt = freeDisciplinePt;

   this.getFreebieMode = getFreebieMode;
   function getFreebieMode(){
     return DisciplineService.getFreebieMode();
   };

  this.isGargoyle = isGargoyle;
  this.getDisciplines = getDisciplines;
  this.selectDisciplinePt = selectDisciplinePt;
  this.disciplinesPage = "./disciplines/disciplines.html";

  this.disciplineList = getDisciplineList();

  function getDisciplineList(){
    return DisciplineService.disciplineList;
  }

  function freeDisciplinePt(discipline, index){
    DisciplineService.freeDisciplinePt(discipline, index);
  }

  function selectDisciplinePt(discipline, index){
    DisciplineService.selectDisciplinePt(discipline, index);
  };

  function isGargoyle(){
    return DisciplineService.isGargoyle();
  };

  this.changeDiscipline = changeDiscipline;
  function changeDiscipline(discipline, index, prevDisc){
    DisciplineService.changeDiscipline(discipline, index, prevDisc);
  };

  this.selectedraceDisciplines = getDisciplines();
  function getDisciplines(){
    return DisciplineService.selectedraceDisciplines;
  };

  this.getDisciplinePts = getDisciplinePts;
  function getDisciplinePts(){
    return DisciplineService.disciplinePts;
  };

  this.addDiscipline = addDiscipline;
  function addDiscipline(){
    DisciplineService.addDiscipline();
  };

  this.removeDiscipline = removeDiscipline;
  function removeDiscipline(index){
    DisciplineService.removeDiscipline(index);
  };

  $scope.$on('loadCharacter', function(){
    DisciplineService.loadedCharacter = true;
    self.selectedraceDisciplines = self.getDisciplines();
    $scope.$apply();
  })

}]);
