var loginModule = angular.module('loginModule', []);

loginModule.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$http',
  function($rootScope, $scope, $location, $routeParams, $http) {
  
    $scope.username = '';
    $scope.password = '';
    
    
    $scope.login = function(formData) {
        var data = JSON.stringify({username: formData.username, password: formData.password});
        $http.post('/api/login', data).
          success(function(data, status, headers, config) {
            $rootScope.token = data.token;
            $rootScope.user = {name: data.username};
            $scope.statusText = 'Success';
            $location.path('/browse');
          }).
          error(function(data, status, headers, config) {
            $scope.statusText = 'Fail';
          });
      };
  }]);
