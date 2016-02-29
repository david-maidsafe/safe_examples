/**
 * Sample site controller
 */
window.maidsafeDemo.controller('SampleTemplateCtrl', ['$scope', '$http', '$state', '$rootScope', 'safeApiFactory',
  function($scope, $http, $state, $rootScope, safe) {
    'use strict';
    $scope.siteTitle = 'My Page';
    $scope.siteDesc = 'This page is created and published on the SAFE Network using the MaidSafe demo app';
    var filePath = '/views/sample_template_layout.html';

    var onServiceCreated = function(err) {
      var goToManageService = function() {
        $state.go('manageService');
      };
      $rootScope.$loader.hide();
      if (err) {
        return $rootScope.prompt.show('Publish Service Error', err, goToManageService);
      }
      var msg = 'Template has been published for the service: ' + $state.params.serviceName;
      $rootScope.prompt.show('Service Published', msg, goToManageService);
    }

    var onTemplateReady = function(err, tempPath) {
      if (err) {
        return console.error(err);
      }
      var serviceName = $state.params.serviceName;
      var uploader = new window.uiUtils.Uploader(safe);
      var progress = uploader.upload(tempPath, false, '/public/' + serviceName);
      progress.onUpdate = function() {
        if (!$rootScope.$loader.isLoading) {
          $rootScope.$loader.hide();
        }
        if (progress.total === (progress.completed + progress.failed)) {
          $rootScope.$loader.show();
          safe.addService(safe.getUserLongName(), serviceName, false, '/public/' + serviceName, onServiceCreated);
        }
      };
    };

    var writeFile = function(title, content, filePath) {
      $rootScope.$loader.show();
      window.uiUtils.createTemplateFile(title, content, filePath, onTemplateReady);
    };


    $scope.registerProgress = function(progressScope) {
      $scope.progressIndicator = progressScope;
    };

    $scope.publish = function() {
      console.log($scope.siteTitle + ' ' + $scope.siteDesc);
      writeFile($scope.siteTitle, $scope.siteDesc, filePath);
    };

    $scope.handleInputClick = function(e) {
      e.stopPropagation();
      e.target.select();
    };
  }
]);
