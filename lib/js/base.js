(function () {
  var db = angular.module("database", ['indexedDB']);

  /*
   * paymentCategory
   * ===============
   *   name:     KEY - The name(dispalyed)
   * 
   * paymentSubcategory
   * ==================
   *   name:     KEY -  The name(displayed)
   *   category: FKEY(paymentCategory)
   * 
   * planning
   * ========
   *   id: KEY
   *   name: The name(displayed)
   *   startDate: The date that this planning item starts.
   *   endDate: The date that this planning item ends.
   *   category: FKEY(paymentSubcategory)
   * 
   */


  db.config(["$indexedDBProvider", function ($indexedDBProvider) {
      $indexedDBProvider
              .connection('org.lee.budgetly')
              .upgradeDatabase(1, function (event, db, tx) {
                var categoryStore = db.createObjectStore('paymentCategory', {keyPath: ['category', 'name']});
                categoryStore.createIndex('category', 'category', {unique: false});
                categoryStore.createIndex('name', 'name', {unique: false});

                var planningStore = db.createObjectStore('planning', {keypath: 'id', autoIncrement: true});
                planningStore.createIndex('name', 'name', {unique: false});
                planningStore.createIndex('startDate', 'startDate', {unique: false});
                planningStore.createIndex('endDate', 'endDate', {unique: false});
                planningStore.createIndex('category', 'category', {unique: false});
              });
    }
  ]);

  db.service("categoryDB", ["$indexedDB", "$q",
    function ($indexedDB, $q) {
      // All functions return a promise to the data.
      function CategoryDB() {
      }
      CategoryDB.prototype.getCategories = function (ordering) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.eachBy("name", {direction: $indexedDB.queryDirection[ordering]});
        });
      }
      CategoryDB.prototype.getCategoriesIn = function (categoryFilter) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.findBy("category", categoryFilter);
        });
      }
      CategoryDB.prototype.getCategory = function (catName, name) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.findBy('category&name', [catName, name]);
        });
      }
      CategoryDB.prototype.putCategory = function(categoryObject) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.insert(categoryObject);
        });
      }
      CategoryDB.prototype.deleteCategory = function(categoryObject) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.delete([categoryObject.category, categoryObject.name]);
        });
      }
      return new CategoryDB();
    }
  ]);
  db.service("planningDB", [
    "$indexedDB", "$q",
    function ($indexedDB, $q) {
      function PlanningDB() {
      }
      PlanningDB.prototype.getPlannigEntries = function (ordering) {
        return $indexedDB.openStore('planning', function (plan) {
          return plan.each("id", {direction: $indexedDB.queryDirection[ordering]});
        });
      }
      return new PlanningDB();
    }
  ]);






})();


