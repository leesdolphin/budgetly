(function () {

  var directives = angular.module("directives", ['database']);

  console.log(directives);

  directives.directive("blPlanningEdit", [
    "planningDB",
    function (wrapper) {
      return {
        restrict: 'E',
        scope: {
          onComplete: '&',
          key: "="
        },
        controller: function ($scope) {
          $scope.plan =
                  $scope.$watch("key", function () {

                  });
        },
      };
    }
  ]);
  directives.directive("blPlanningForm", [
    function () {
      return {
        templateUrl: "lib/directives/planning/data_form.html",
        restrict: 'E',
        transclude: true,
        scope: {
          store: "=object",
        },
      }
    }
  ]);

  directives.directive("blEditButtonGroup", [
    function () {
      return {
        templateUrl: "lib/directives/editButtonGroup.html",
        restrict: 'E',
        scope: {
          "delete": '&',
          "showDelete": "=",
          "edit": '&',
          "showEdit": "=",
        },
        controller: function () {
        },
      };
    }
  ])


})();