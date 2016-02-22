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
  });
    
});

// Author date filter
potato.filter('authorFilter', function() {
  return function(author) {
    var string = author;
    var authorString = string.substring(string.lastIndexOf("(")+1,string.lastIndexOf(")"));
    return authorString;
  }
});


// Published date filter
potato.filter('pubDate', function() {
  return function(published){
    var fullDate = published;
    var year = fullDate.substring(0,4);
    var month = parseInt(fullDate.substring(5,7));
    var day = fullDate.substring(8,10);
    var time = fullDate.substring(fullDate.lastIndexOf("T")+1,fullDate.lastIndexOf(":"));

    var dayLast = day.charAt(day.length - 1);
    var timeFirst = time.charAt(0);

    // Removes superfluous '0' from published time
    if (timeFirst === "0") {
      time = time.replace("0", "");
    }

    // Adds suffix to day
    if (dayLast === 1){
      day = day + "st";
    } else if (dayLast === 2) {
      day = day + "nd";
    } else {
      day = day + "th";
    }

    // Converts month number to month name
    if (month === 01) {
      month = "Jan";
    } else if (month === 02){
      month = "Feb";
    } else if (month === 03){
      month = "Mar";
    } else if (month === 04){
      month = "Apr";
    } else if (month === 05){
      month = "May";
    } else if (month === 06){
      month = "Jun";
    } else if (month === 07){
      month = "Jul";
    } else if (month === 08){
      month = "Aug";
    } else if (month === 09){
      month = "Sep";
    } else if (month === 10){
      month = "Oct";
    } else if (month === 11){
      month = "Nov";
    } else if (month === 12){
      month = "Dec";
    }

    return day + " " + month + " " + year + " at " + time;
  }

});
