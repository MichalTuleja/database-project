var browserModule = angular.module('browserModule', []);

browserModule.controller('BrowserCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$location',
  function($rootScope, $scope, $routeParams, $http, $location) {
  
      var httpConfig = {
        headers:  {
            'Authorization': $rootScope.token,
            'Accept': 'application/json;odata=verbose'
        }
    };
  
    var getData = function(url, callback) {
        $http.get(url, httpConfig).
          success(function(data, status, headers, config) {
            callback(data);
          }).
          error(function(data, status, headers, config) {
            $location.path('/login');
          });
    }
    
    $scope.tables = [];
    $scope.reports = [];
    var tableData = [];
    $scope.header = [];
    $scope.content = [];
    $scope.title = 'Title';
    $scope.tableData = [];
    
    

    
    getData('/api/tables', function(data) {
        $scope.tables = data;
    });
    
    getData('/api/reports', function(data) {
        $scope.reports = data;
    });
    
    $scope.showData = function(tableName) {
        $scope.title = tableName;
         $scope.header = [];
            $scope.content = [];
            
        getData('/api/table/' + tableName, function(data) {
            var fieldArr = [];
            
            for(var i in data.data) {
                fieldArr.push(data.data[i].Field);
            }
            
            getData('/api/table/' + tableName + '/' + fieldArr.join(','), function(data) {
                tableData = data.data;
                
                for(var i in tableData) {
                    var arr = [];
                    
                    if(i === "0") {
                        for(var j in tableData[i]) {
                            $scope.header.push(j);
                        }
                    }
                
                    for(var j in tableData[i]) {
                        arr.push(tableData[i][j]);
                    }
                    
                    $scope.content.push(arr);
                    
                    $scope.tableData = data.data;
                }
            });
        });
    };
  }]);
