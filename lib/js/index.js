(function () {
  var module = angular.module("index", ['database', 'filters', 'ui.bootstrap', 'directives']);

  module.controller("BaseController", [
    '$scope', '$rootScope', 'categoryDB', 'planningDB',
    function ($scope, $rootScope, categoryDB, planningDB) {
      $scope.$on('dbRefresh', function () {
        categoryDB.getCategories().then(function (all) {
          $scope.categories = all;
          $scope.keyed_categories = {};
          all.forEach(function(cat) {
            if(!$scope.keyed_categories[cat.category]) {
              $scope.keyed_categories[cat.category] = {};
            }
            $scope.keyed_categories[cat.category][cat.name] = cat;
          });
        });
        planningDB.getPlannigEntries().then(function (all) {
          $scope.planning = all;
        });
      });

      $rootScope.refresh = function () {
        $rootScope.$broadcast('dbRefresh');
      }
    }
  ]);
  module.controller("CategoryList", [
    '$scope', 'categoryDB',
    function ($scope, categoryDB) {

      $scope.deleteCategory = function (category) {
        categoryDB.deleteCategory(category).then(function () {
          $scope.refresh();
        });
      }
      $scope.refresh();
    }
  ]);
  module.controller("CategoryAdder", [
    '$scope', 'categoryDB',
    function ($scope, categoryDB) {
      $scope.store = {}
      $scope.store.name = "";
      $scope.store.category = "";
      $scope.categories = [];

      $scope.create = function () {
        categoryDB.putCategory({name: $scope.store.name, category: $scope.store.category}).then(function () {
          $scope.refresh();
          $scope.name = "";
          $scope.category = "";
        });
      }

      $scope.$on('dbRefresh', function () {
        categoryDB.getCategories().then(function (all) {
          var superCats = {}
          all.forEach(function (obj) {
            superCats[obj["category"]] = true;
          });
          $scope.categories = Object.keys(superCats).sort();
        });
      });
      $scope.refresh();
    }
  ]);

  module.controller("PlanningList", [
    '$scope', 'planningDB',
    function ($scope, planningDB) {
      $scope.delete = function (entry) {
        planningDB.deletePlanningEntry(entry.id).then(function () {
          $scope.refresh();
        });
      }
      $scope.refresh();
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
        planningDB.putPlan(store).then(function() {
          $scope.store = {};
          $scope.tmp = {};
          $scope.refresh();
        });
      }
    }
  ]);

})();