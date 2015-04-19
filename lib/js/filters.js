(function () {
  var filters = angular.module("filters", []);

  filters.filter("keys", [
    function () {
      return function (object) {
        return Object.keys(object || {});
      }
    }]);

  filters.filter("formatMoment", [
    function () {
      return function (time, format) {
        return moment(time).format(format);
      }
    }]);
  
  filters.filter("formatCategory", [
    function() {
      return function(category) {
        return category.category + "/" + category.name;
      }
    }]);
  
  filters.filter("formatPeriod", [
    function() {
      return function(period) {
        return period.number + " " + period.period;
      }
    }]);



})()

