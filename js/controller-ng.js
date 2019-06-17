  var app = angular.module('myApp', [])
  app.constant("miServicioConstante","[{ message: 'Hello' },{ message: 'Hello111' }]");

  app.controller('reports', ['$scope',
    function ($scope){

      $scope.dataSearch = dataSet

      $scope.setDataset = function(){

        $scope.warningDates=false
        $scope.warningNotResults=false
        if (!$scope.date_from || !$scope.date_to){
          $scope.warningDates=true;
          return false
        }
        let dateFrom=$scope.date_from
        let dateto=$scope.date_to
        let dateParts = dateFrom.split("/");
        let fromDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        dateParts = dateto.split("/");
        let toDate =new Date( new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).setHours(23, 59, 59, 999))
        $scope.dataSearch = dataSet.filter((item) =>
            new Date(item.date_closed) >= fromDate && new Date(item.date_closed) <= toDate
        );
        $scope.modZones=$scope.modResumen=$scope.modWaiters=false
        $scope.modCashiers=$scope.modTables=$scope.modProducts=false
        if(!$scope.dataSearch.length){
          $scope.warningNotResults=true;
          return false
        }
      };

      /*ZONES*/
      $scope.modZones = false;
      $scope.reportZones = function(){
        let countZ = getGroupOrdered( getGroupByName($scope.dataSearch, 'zone'), 'count' );
        let totalZ = getGroupOrdered( getGroupByName($scope.dataSearch, 'zone'), 'total' );
        $scope.countZ = countZ
        $scope.totalZ = totalZ
        $scope.modZones = !$scope.modZones;
      };

      /*WAITERS*/
      $scope.modWaiters = false;
      $scope.reportWaiters = function(){
        let countW = getGroupOrdered( getGroupByName($scope.dataSearch, 'waiter'), 'count' );
        let totalW = getGroupOrdered( getGroupByName($scope.dataSearch, 'waiter'), 'total' );
        $scope.countW = countW
        $scope.totalW = totalW
        $scope.modWaiters = !$scope.modWaiters;
      };

      /*CASHIERS*/
      $scope.modCashiers = false;
      $scope.reportCashiers = function(){
        let countC = getGroupOrdered( getGroupByName($scope.dataSearch, 'cashier'), 'count' );
        let totalC = getGroupOrdered( getGroupByName($scope.dataSearch, 'cashier'), 'total' );
        $scope.countC = countC
        $scope.totalC = totalC
        $scope.modCashiers = !$scope.modCashiers;
      };

      /*TABLES*/
      $scope.modTables = false;
      $scope.reportTables = function(){
        let countT = getGroupOrdered( getGroupByName($scope.dataSearch, 'table'), 'count' );
        let totalT = getGroupOrdered( getGroupByName($scope.dataSearch, 'table'), 'total' );
        $scope.countT = countT
        $scope.totalT = totalT
        $scope.modTables = !$scope.modTables;
      };

      /*PRODUCTS*/
      $scope.modProducts = false;
      $scope.reportProducts = function(){
        let prods = getProductsGroup($scope.dataSearch)
        let countP = getProductsOrdered( prods, 'count');
        let totalP = getProductsOrdered( prods, 'total');
        $scope.countP = countP
        $scope.totalP = totalP
        $scope.modProducts = !$scope.modProducts;
      };

      /*RESUMEN*/
      $scope.modResumen = false;
      $scope.reportResumen = function(){
        let countR = groupBySumDateClosed($scope.dataSearch);
        $scope.totalSales = totalSales($scope.dataSearch)
        $scope.totalOrders = totalOrders($scope.dataSearch)
        $scope.countR = countR
        $scope.modResumen = !$scope.modResumen;
      };

    }
  ]);
  app.filter("currencyCL", function(){
    // filtro para moneda CL
    return function(input){
      if (isNaN(parseFloat(input))) return "";
      input = Math.round(parseFloat(input)*100)/100;
      return Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(input)
    }
  });
  app.filter("dateddmmyyyy", function(){
    // filtro para fecha
    return function(date){
      return new Date(date).toJSON().slice(0,10).split('-').reverse().join('/')
    }
  });

  app.directive('datepicker', function() {
         return {
            restrict: 'A',
            require: 'ngModel',
            compile: function() {
               return {
                  pre: function(scope, element, attrs, ngModelCtrl) {
                     var format, dateObj;
                     format = (!attrs.dpFormat) ? 'dd/mm/yyyy' : attrs.dpFormat;
                     if (!attrs.initDate && !attrs.dpFormat) {
                        dateObj = new Date();
                        scope[attrs.ngModel] = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
                     }  else if (!attrs.initDate) {
                        scope[attrs.ngModel] = attrs.initDate;
                     } else {
                       scope[attrs.ngModel] = attrs.initDate;
                     }
                     $(element).datepicker({
                        format: format,
                     }).on('changeDate', function(ev) {
                        scope.$apply(function () {
                           ngModelCtrl.$setViewValue(ev.format(format));
                        });
                     });
                  }
               }
            }
         }
      });

  angular.element(function() {
    angular.bootstrap(document, ['myApp']);
  });
