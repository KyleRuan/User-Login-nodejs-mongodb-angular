/**
 * Created by kyle on 2016/12/2.
 */

/**
 * 提供 Angular模块和控制器的定义
 */

angular.module('myApp', []).
controller('myController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
          $scope.user = data;
          $scope.error = "";
        }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });
  }]);

