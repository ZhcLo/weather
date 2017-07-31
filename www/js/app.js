angular.module('app', [
  'ionic', 'services', 'info.ctrl', 'list.ctrl'
])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("info", {
        url: "/info",
        views: {
          "content": {
            templateUrl: "views/info/p.html",
            controller: "infoCtrl"
          }
        }
      })
      .state("list", {
        url: "/list",
        views: {
          "content": {
            templateUrl: "views/list/p.html",
            controller: "listCtrl"
          }
        }
      });
    $urlRouterProvider.otherwise("/info");
  })
  .filter("wicon", function () {
    var icons = {
      "晴": "wi-day-sunny",
      "阴": "wi-cloudy",
      "小雨": "wi-showers",
      "中雨": "wi-hail",
      "阵雨": "wi-sleet",
      "大雨": "wi-rain",
      "雷阵雨": "wi-storm-showers",
      "多云": "wi-night-cloudy",
      "小到中雨": "wi-rain-mix",
      "中到大雨": "wi-hail"
    };
    return function (type) {
      return icons[type];
    };
  })
