(function () {
  var wrap = angular.module("wrapper", ['database']);

  wrap.service("categoryWrapper", [
    '$rootService', '$q', 'categoryDB',
    function ($rootService, $q, categoryDB) {
      var x = new CategoryWrapper();
      $rootService.$on('dbRefresh', function () {
        x.getPromise(true);
      });
      function CategoryWrapper() {
        var self = this;
        self.categorys = undefined;
        self.loadingPromise = undefined;
        self.keyed_categories = undefined;
        self._defered = $q.defer()
        self.notifyPromise = defered.promise;
      }
      CategoryWrapper.prototype.getAllCategorys = function () {
        var self = this;
        return self.getPromise().then(function () {
          return self.categories;
        });
      };
      CategoryWrapper.prototype.getCategorysByCategory = function () {
        var self = this;
        return self.getPromise().then(function () {
          return self.keyed_categories;
        });
      };
      CategoryWrapper.prototype.putCategory = function(category) {
        var self = this;
        return self.updateDb(function() {
          return categoryDB.putCategory(category)
        });
      }
      CategoryWrapper.prototype.updateCategory = function(category) {
        var self = this;
        return self.updateDb(function() {
          return categoryDB.updateCategory(category);
        });
      }
      CategoryWrapper.prototype.deleteCategory = function(category) {
        var self = this;
        return self.updateDb(function() {
          return categoryDB.deleteCategory(category);
        });
      }
      CategoryWrapper.prototype.updateDb = function (updateFn) {
        return $q.when(updateFn()).then(function(res) {
          return self.getPromise(true).then(function() {
            return res;
          })
        });
      }
      CategoryWrapper.prototype.getPromise = function (forceRefresh) {
        var self = this;
        if (forceRefresh || !this.loadingPromise) {
          self.loadingPromise = this.doRefresh();
        }
        return self.loadingPromise;
      }
      CategoryWrapper.prototype.doRefresh = function () {
        var self = this;
        return categoryDB.getCategories().then(function (all) {
          self.categories = all;
          self.keyed_categories = {};
          all.forEach(function (cat) {
            if (!self.keyed_categories[cat.category]) {
              self.keyed_categories[cat.category] = {};
            }
            self.keyed_categories[cat.category][cat.name] = cat;
          });
          self._defered._notify();
        });
      }




    }]);

})();


