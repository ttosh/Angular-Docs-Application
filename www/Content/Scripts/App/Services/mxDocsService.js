"use strict";

MxDocsApp.factory('mxDocsService', ['$rootScope', '$interval', '$localStorage', 'mxDocsFactory', function ($rootScope, $interval, $localStorage, mxDocsFactory) {
    var data = $localStorage.$default({
        Docs: []
    });
    var pollerStarted = false;
    var stop;

    var poller = function () {
        mxDocsFactory.getMxDocs().then(function (result) {
            data.Docs = result.data;
            $rootScope.$broadcast('docs:changed', true);
        });
        stop = $interval(getFiles, 14400000);
    };

    function getFiles() {
        mxDocsFactory.getMxDocs().then(function (result) {
            pollerStarted = true;
            data.Docs = result.data;
            $rootScope.$broadcast('docs:changed', true);
        }, function (error) {
            pollerStarted = true;
            console.log(error);
        });
    };
    return {
        startPoller: function () {
            if (!pollerStarted)
                poller();
        },
        stopPoller: function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
                pollerStarted = false;
            }
        },
        showLoading: function (msg) {
             if (typeof cordova !== "undefined") {
                cordova.plugin.pDialog.init({
                    theme: 'HOLO_DARK',
                    progressStyle: 'SPINNER',
                    cancelable: true,
                    title: 'Please Wait...',
                    message: msg
                });
            } 
        },
        hideLoading: function () {
             if (typeof cordova !== "undefined") {
                cordova.plugin.pDialog.dismiss();
            } 
        }
    }
}])