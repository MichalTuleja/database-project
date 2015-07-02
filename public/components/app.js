/* Database App
 * 
 * Author: Michal Tuleja <michal.tuleja@outlook.com>
 */

'use strict';

// Initialize app
var databaseApp = angular.module('databaseApp', 
[
//'ui.bootstrap', 
'ngRoute',
'loginModule',
'dashboardModule',
'browserModule'
]);

databaseApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'components/dashboard/dashboard.template.html',
        controller: 'DashboardCtrl'
      }).
      when('/browse', {
        templateUrl: 'components/browser/browser.template.html',
        controller: 'BrowserCtrl'
      }).
      when('/login', {
        templateUrl: 'components/login/login.template.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
  


