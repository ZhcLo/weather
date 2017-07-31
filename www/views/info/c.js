
angular.module("info.ctrl", [])
  .controller('infoCtrl', ["$scope", "$timeout", "$http", "Codes", "LS", function ($scope, $timeout, $http, Codes, LS) {
    $scope.codes = LS.load();
    $scope.times = 90000; // LS.get(), LS.set()
    console.log("codes @LS:", $scope.codes);
    $scope.data = [];
    var info = [];
    // 用于排序的序号检索方法
    var getIndex = function(city){
      for(var i = 0; i < $scope.codes.length; i++){
        if ($scope.codes[i].name == city){
          return i;
        }
      }
      return -1;
    };
    // 转换输出数据
    var result = function () {
      $scope.codes = LS.load(); // 及时响应城市列表的排序
      //{gm: '', wd: '', wk: [{},{},{},{},{}]}
      $scope.data = [];
      for (var i = 0; i < info.length; i++) {
        var m = (new Date()).getMonth() + 1, d = 0;
        $scope.data.push({
          city: info[i].city,
          gm: info[i].ganmao,
          wd: info[i].wendu,
          wk: []
        });
        var cast = info[i].forecast;
        for (var j = 0; j < cast.length; j++) {
          var s = cast[j].date.split("日"); // "date": "29日星期一"
          if (d == 0) d = s[0];
          if (s[0] < d) if (++m > 12) m = 1; // 下一月开始
          // 33／26℃ <== (1)"high": "高温 33℃" (2)"low": "低温 26℃",
          var h = ((cast[j].high.split(" "))[1].split("℃"))[0];
          var l = (cast[j].low.split(" "))[1];
          $scope.data[i].wk.push({
            week: s[1]/*.replace("星期", "周")*/,
            day: m + "月" + s[0] + "日",
            tmp: h + '／' + l,
            fx: cast[j].fengxiang,
            fl: cast[j].fengli,
            type: cast[j].type
          });
        }
      }
      // 数据的排序： 返回值==1(==true)：交换，其他值：不动
      $scope.data.sort(function(a, b){
        // a.city get index = 1
        var a_index = getIndex(a.city);
        var b_index = getIndex(b.city);
        return a_index > b_index; // 应该是: a_index < b_index
        // return getIndex(a.city) > getIndex(b.city);
      });
      //console.log("weather data:", $scope.data);
      $timeout(result, 2000);
    };
    var getInfo = function () {
      info = []; // 初始化
      // http://wthrcdn.etouch.cn/weather_mini?citykey=101020100
      for (var i = 0; i < $scope.codes.length; i++) {
        // promise
        $http.get("http://wthrcdn.etouch.cn/weather_mini", {
          params: {citykey: $scope.codes[i].code}
        }).then(function (resp) {
          info.push(resp.data.data);
        }, function () {
        });
      }
      console.log("weather info:", info);
      $timeout(getInfo, $scope.times);
    };
    // 监视器:跟踪 codes 城市地区列表变化,更新气象信息
    $scope.$watch('codes', function(nv, ov){
      console.log("update ...", Date.now());
      getInfo();
    }, true);
    //getInfo();
    result();
  }]);




















/*
angular.module("info.ctrl", [])
  .controller('infoCtrl', ["$scope", "$http", "Codes", function ($scope, $http, Codes) {
    $scope.codes = Codes.get("101010");
    //console.log("城市地区代码表:", $scope.codes);
    $scope.data = {city: "上海"};
    $scope.show = [];
    $scope.info = '';
    // http://wthrcdn.etouch.cn/weather_mini?city=上海
    $scope.getInfo = function () {
      console.log("当前城市:", $scope.data.city);
      // 采用console.log()进行适当良好的信息状态跟踪是新手到高手的必由之路!
      $http.get("http://wthrcdn.etouch.cn/weather_mini", {
        params: {city: $scope.data.city}
      }).then(function (resp) {
        // 成功接收信息之处理 // console.log("成功:", resp);
        //console.log("数据:", resp.data.data);
        $scope.info = resp.data.data;
        $scope.output();
        console.log($scope.show);
      }, function (resp) {
        // 失败接收信息之处理
        console.log("失败:", resp);
      });
    };
    //$scope.getInfo();
    $scope.output = function () {
      $scope.show = [];
      var m = (new Date()).getMonth() + 1, d = 0;
      var info = $scope.info.forecast;
      for (var i = 0; i < info.length; i++) {
        var s = info[i].date.split("日"); // "date": "29日星期一"
        if (d == 0) d = s[0];
        if (s[0] < d) if (++m > 12) m = 1; // 下一月开始
        // 33／26℃ <== (1)"high": "高温 33℃" (2)"low": "低温 26℃",
        var h = ((info[i].high.split(" "))[1].split("℃"))[0];
        var l = (info[i].low.split(" "))[1];
        $scope.show.push({
          week: s[1]/!*.replace("星期", "周")*!/,
          day: m + "月" + s[0] + "日",
          tmp: h + '／' + l,
          fx: info[i].fengxiang,
          fl: info[i].fengli,
          type: info[i].type
        });
      }
    };
  }]);
*/

