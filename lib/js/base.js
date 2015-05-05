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

                var planningStore = db.createObjectStore('planning', {keyPath: 'id', autoIncrement: true});
                planningStore.createIndex('name', 'name', {unique: false});
                planningStore.createIndex('startDate', 'startDate', {unique: false});
                planningStore.createIndex('endDate', 'endDate', {unique: false});
                planningStore.createIndex('category', 'category', {unique: false});
              })
    }
  ]);

  db.service("dbBase", [
    "$indexedDB", "$q",
    function ($indexedDB, $q) {
      createWrapper.prototype.getAll = getAll;
      createWrapper.prototype.get = get;
      createWrapper.prototype.insert = insert;
      createWrapper.prototype.update = insert;
      createWrapper.prototype.del = del;
      createWrapper.prototype["delete"] = del;

      return createWrapper;
      function createWrapper(dbName, opts) {
        /**
         * Valid Options:
         *   - 'sortKey'
         *   - 'sortOrder'
         *   - 'validate'
         *   - 'key'
         */
        this.dbName = dbName;
        this.key = opts['key'];
        // The code checks for undefined explicity.
        this.sortKey = opts['sortKey'] || undefined;
        this.sortOrder = $indexedDB.queryDirection[opts['sortOrder']] || undefined;
        this.validate = opts['validate'] || function () {
          return true;
        };
      }
      function getAll() {
        return $indexedDB.openStore(this.dbName, function (psc) {
          return psc.eachBy(this.sortKey, {direction: this.sortOrder});
        });
      }
      function get() {
        var key = arguments;
        if (key.length === 0) {
          $q.reject("No key to get");
        } else if (key.length === 1) {
          // 1 length key so extract it.
          key = key[0];
        }
        return $indexedDB.openStore(this.dbName, function (psc) {
          return psc.find(key);
        });
      }
      function insert(obj) {
        if (obj.$key) {
          // Calling insert with an existing object. Use the correct method
          return this.update(obj);
        }
        var self = this;
        return $q.when().then(function () {
          if (self.validate(obj)) {
            return $indexedDB.openStore(self.dbName, function (transaction) {
              return transaction.upsert(obj);
            }).then(function (res) {
              if (self.key) {
                // Handle inserting the auto-generated key myself.
                if (obj[self.key] === undefined) {
                  obj[self.key] = res[0];
                  return self.insert(obj);
                }
              }
              return res;
            });
          } else {
            throw "Invalid Object";
          }
        });
      }
      function del(obj) {
      }
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
      CategoryDB.prototype.getCategory = function (catName, name) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.find([catName, name]);
        });
      }
      CategoryDB.prototype.putCategory = function (categoryObject) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.insert(categoryObject);
        });
      }
      CategoryDB.prototype.updateCategory = function (categoryObject) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.insert(categoryObject);
        });
      }
      CategoryDB.prototype.deleteCategory = function (categoryObject) {
        return $indexedDB.openStore('paymentCategory', function (psc) {
          return psc.delete(categoryObject.$key);
        });
      }
      return new CategoryDB();
    }
  ]);
  db.service("planningDB", [
    "dbBase",
    function (dbBase) {
      return new dbBase('planning', {
        'key': 'id',
        'validate': undefined, // TODO
      });
    }
  ]);
})();


