var potato = angular.module("potato",  ["ui.router"]);


// Set-up

potato.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'mainPotato',
    templateUrl: '/templates/home.html'
  });

  $stateProvider.state('testing', {
    url: '/',
    controller: 'mainPotato',
    templateUrl: '/templates/testing.html'
  });

}]);



potato.factory('PotatoPics', function($http) {
  return {
    getPics: function(callback) {
      return $http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK')
      .success(function(data) {
        callback(data);
      })
      .error(function(data){
        console.log('Error');
      });
    }
  };
});



// Homepage controller

potato.controller('mainPotato', function($scope, $rootScope, PotatoPics) {
  PotatoPics.getPics(function(data){
    $rootScope.listings = data.items;
  });

  


});



