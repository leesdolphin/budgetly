(function () {
  var wrap = angular.module("wrapper", ['database']);

  wrap.factory("wrapperBase", [
    '$q',
    function ($q) {
      function WrapperConstructor(child, db) {
        this.child = child;
        this.db = db;
        // Delegate to the child constructor.
        child.call(this);

        // Refresh the data now. 
        this.loadPromise = this.refreshAfter(this);
      }
      WrapperConstructor.prototype.refreshAfter = function (promise) {
        var self = this;
        return $q.when(promise).then(function (res) {
          return $q.when(self.child.refresh.apply(self)).then(function () {
            // Wait for refresh before resolving the original promise.
            return res;
          })
        });
      }

      WrapperConstructor.prototype.get = function (key) {
        return this.db.get(key);
      }
      WrapperConstructor.prototype.del = function (key) {
        return this.refreshAfter(this.db.del(key));
      }
      // Allow `delete` but prevent an error in IE.
      WrapperConstructor.prototype["delete"] = WrapperConstructor.prototype.del;
      WrapperConstructor.prototype.update = function (object) {
        return this.refreshAfter(this.db.update(object));
      }
      WrapperConstructor.prototype.insert = function (object) {
        return this.refreshAfter(this.db.insert(object));
      }
      return function (childConstructor, db) {
        return new WrapperConstructor(childConstructor, db);
      }
    }
  ]);


  wrap.service("categoryWrapper", [
    'categoryDB', 'wrapperBase',
    function (categoryDB, wrapperBase) {
      function CategoryWrapper() {
      }
      CategoryWrapper.refresh = function () {
        var self = this;
        return categoryDB.getCategories().then(function (all) {
          self.all = all;
          self.by_category = {};
          all.forEach(function (cat) {
            if (!self.by_category[cat.category]) {
              self.by_category[cat.category] = {};
            }
            self.by_category[cat.category][cat.name] = cat;
          });
        });
      };
      return wrapperBase(CategoryWrapper, categoryDB);
    }]);

  wrap.service("planningWrapper", [
    'planningDB', 'wrapperBase',
    function (planningDB, wrapperBase) {
      function PlanningWrapper() {
      }
      PlanningWrapper.refresh = function () {
        var self = this;
        return planningDB.getCategories().then(function (all) {
          self.all = all;
          self.by_category = {};
          all.forEach(function (cat) {
            self.by_category[cat.category] = cat;
          });
        });
      };
      return wrapperBase(PlanningWrapper, planningDB);
    }]);

})();


