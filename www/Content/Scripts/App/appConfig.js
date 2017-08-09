var MxDocsApp = angular.module('MxDocsApp', ['ngCordova', 'ngStorage']);

MxDocsApp.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|launch):/);
    }
]);