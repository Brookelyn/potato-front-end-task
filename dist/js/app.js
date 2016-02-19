var potato = angular.module("potato",  ["ui.router"]);



// Set-up
potato.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'mainPotato',
    templateUrl: '/templates/home.html'
  });

  $stateProvider.state('detail', {
    // : indicates that id is a variable that will be called in later
    url: '/detail/:id',
    controller: 'detailPotato',
    templateUrl: '/templates/detail.html'
  });

}]);



// Factory to get data
potato.factory('PotatoPics', function($http) {
  
  var json;

  function getJSON(callback) {
    return $http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK')
    .success(function(data) {
      json = data;
      callback(data);
    })
    .error(function(data){
      console.log('Error');
    });
  }

  return {
    getPics: function(callback) {
      if (json) {
        return json;
      } else {
        getJSON(callback);
      }
    },
    getDetail: function(id, callback) {
      if (json) {
        return callback(json.items[id]);
      } else {
        getJSON(function() {
          return callback(json.items[id]);
        });
      }
    }
  };
});



// Homepage controller
potato.controller('mainPotato', function($scope, PotatoPics) {
  
  PotatoPics.getPics(function(json){
    $scope.listings = json.items;
  });
    
});



// Detail page controller
potato.controller('detailPotato', function($scope, PotatoPics, $stateParams) {
  
  PotatoPics.getDetail($stateParams.id, function(data){
    $scope.listing = data;
    var author = author;
    console.log(author);
  });
    
});

// Author date filter
potato.filter('authorFilter', function() {
  return function(author) {
    var string = author;
    var authorString = string.substring(string.lastIndexOf("(")+1,string.lastIndexOf(")"));;
    return authorString;
  }
});


