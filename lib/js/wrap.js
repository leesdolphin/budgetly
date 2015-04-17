(function () {
  var wrap = angular.module("wrapper", ['database']);

  wrap.service("categoryWrapper", [
    '$rootService', '$q', 'categoryDB',
    function($rootService, $q, categoryDB) {
    var x = new CategoryWrapper();
    $rootService.$on('dbRefresh', function() {
      x.doRefresh();
    });
    
    
    function CategoryWrapper() {
      this.categorys = undefined;
      this.plannings = undefined;
    }
    CategoryWrapper.prototype.getAllCategorys = function() {
      if(this.categorys) {
        return $q.resolve(this.categorys);
      }
      this.categorys = [];
      return categoryDB.getCategories().then(function(all) {
        this.categorys = all;
        return this.categorys;
      });
    };
    CategoryWrapper.prototype.getCategorysByCategory = function() {
      
    };
    
    
    
    
  }]);

})();


