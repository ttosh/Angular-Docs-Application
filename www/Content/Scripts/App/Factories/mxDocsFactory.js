"use strict";

MxDocsApp.factory('mxDocsFactory', ['$http', function ($http) {
    return {
        getMxDocs: function (dashboardID) {
            var data = $http({ method: 'GET', url: 'http://me.aa.com/mel/mobile/json/all_rev8.asp' });
            return data;
        }
    }

}]);