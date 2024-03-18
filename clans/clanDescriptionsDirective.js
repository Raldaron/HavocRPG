var app = angular.module("site");

app.directive('racedescription',
 ['TermIndexService', 'raceDescriptionsFactory', '$compile',
 function(TermIndexService, raceDescriptionsFactory, $compile) {
    var getTemplate = function(race) {
      return raceDescriptionsFactory[race];
    }
    return {
      restrict: 'E',
      controller: 'raceController',
      controllerAs: 'raceCtrl',
      scope: {
        race: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch('race', function() {
          element.html(getTemplate(scope.race)).show();
          $compile(element.contents())(scope);
        })
      }
    }
  }]);
