(function () {
  var module = angular.module("index", ['wrapper', 'filters', 'ui.bootstrap', 'directives']);

  module.controller("BaseController", [
    '$scope',
    function ($scope) {
      
    }
  ]);
  module.controller("CategoryList", [
    '$scope', 'categoryWrapper',
    function ($scope, categoryWrapper) {
      $scope.cw = categoryWrapper;
    }
  ]);
  module.controller("CategoryAdder", [
    '$scope', 'categoryWrapper',
    function ($scope, categoryWrapper) {
      $scope.store = {}
      $scope.store.name = "";
      $scope.store.category = "";
      $scope.cw = categoryWrapper;

      $scope.create = function () {
        categoryWrapper.insert($scope.store).then(function() {
          $scope.store = {}
        });
      }
    }
  ]);

  module.controller("PlanningList", [
    '$scope', 'planningDB',
    function ($scope, planningDB) {
      $scope.delete = function (entry) {
        planningDB.del(entry.id).then(function () {
          $scope.refresh();
        });
      }
//      $scope.refresh();
    }
  ]);

  module.controller("PlanningAdder", [
    '$scope', 'planningDB',
    function ($scope, planningDB) {
      $scope.store = {};
      $scope.tmp = {};
      $scope.create = function() {
        var store = angular.copy($scope.store);
        store.startDate = moment(store.startDate).valueOf();
        store.endDate = moment(store.endDate).valueOf();
        planningDB.insert(store).then(function() {
          $scope.store = {};
          $scope.tmp = {};
          $scope.refresh();
        });
      }
    }
  ]);

})();