MxDocsApp.controller('MxDocsController', function ($scope, $localStorage, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, mxDocsService) {

    var MxDocsCtrl = this;
    MxDocsCtrl.list = [];

    MxDocsCtrl.FileFilter = {
        fleet: ""
    };

    MxDocsCtrl.TypeFilter = {
        type: "MEL"
    };

    MxDocsCtrl.isCheckedOut = true;
    MxDocsCtrl.targeDirectory = "";
    MxDocsCtrl.GetData = function () {
        MxDocsCtrl.targeDirectory = (device.platform === 'iOS') ? cordova.file.dataDirectory : cordova.file.externalRootDirectory;
        mxDocsService.startPoller();
        MxDocsCtrl.isCheckedOut = true;
        MxDocsCtrl.list = MxDocsCtrl.CheckFiles($localStorage.Docs);
    };

    MxDocsCtrl.Download = function (item) {
        if (!MxDocsCtrl.deleting) {
            if (typeof cordova !== 'undefined') {
                var filename = item.url.split("/").pop();
                var uri = item.url;
                var targetPath = MxDocsCtrl.targeDirectory + "MxDocs/" + item.fleet + "/" + filename;

                var options = {
                    title: filename,
                    documentView: {
                        closeLabel: '<< Back'
                    },
                    navigationView: {

                        closeLabel: 'Close'
                    },
                    email: {
                        enabled: false
                    },
                    print: {
                        enabled: false
                    },
                    openWith: {
                        enabled: false
                    },
                    bookmarks: {
                        enabled: true
                    },
                    search: {
                        enabled: false
                    },
                    autoClose: {
                        onPause: false
                    }
                }
                if (!item.isDownloaded) {
                    mxDocsService.showLoading("Dowloading File ...");
                    $cordovaFileTransfer.download(decodeURI(uri), decodeURI(targetPath))
                        .then(function (result) {
                            // Success!
                            mxDocsService.hideLoading();

                            if (device.platform === 'iOS') {
                                cordova.plugins.SitewaertsDocumentViewer.viewDocument(
                                    encodeURI(targetPath), 'application/pdf', options,
                                    function () { // onShow

                                    }, function () { // onClose

                                    }, function () { // onMissingApp

                                    }, function (error) {
                                        console.log(error);
                                    }, []);

                            } else {
                                $cordovaFileOpener2.open(
                                    encodeURI(targetPath),
                                    'application/pdf'
                                ).then(function () {
                                    // file opened successfully
                                    console.log('File Open Success');
                                }, function (err) {
                                    console.log(err);
                                    // An error occurred. Show a message to the user
                                });
                            }

                            item.isDownloaded = true;
                        }, function (error) {
                            // Error
                            mxDocsService.hideLoading();
                            alert("There was an error downloading the MEL");
                        }, function (progress) {
                        });
                } else {
                    if (device.platform === 'iOS') {
                        cordova.plugins.SitewaertsDocumentViewer.viewDocument(
                            encodeURI(targetPath), 'application/pdf', options,
                            function () { // onShow

                            }, function () { // onClose

                            }, function () { // onMissingApp

                            }, function (error) {
                                console.log(error);
                            }, []);
                    } else {
                        $cordovaFileOpener2.open(
                            encodeURI(targetPath),
                            'application/pdf'
                        ).then(function () {
                            console.log('File Open Success');
                            // file opened successfully
                        }, function (err) {
                            item.isDownloaded = false;
                            MxDocsCtrl.Download(item);
                            // An error occurred. Show a message to the user
                        });
                    }  
                }
            } else {
                window.open(item.url);
            }
        } else {
            MxDocsCtrl.deleting = false;
        }
    }

    MxDocsCtrl.Delete = function (item) {
        if (typeof cordova !== 'undefined') {
            var filename = item.url.split("/").pop();
            MxDocsCtrl.deleting = true;
            $cordovaFile.checkFile(MxDocsCtrl.targeDirectory + "MxDocs/" + item.fleet + "/", filename)
                .then(function (data) {
                    data.file(function (file) {
                        var answer = confirm("Do you want to Delete " + item.title + " ?")
                        if (answer) {
                            $cordovaFile.removeFile(MxDocsCtrl.targeDirectory + "MxDocs/" + item.fleet + "/", filename);
                            item.isDownloaded = false;
                            $scope.$apply();
                        }
                    });
                }, function (error) {
                });
        }
    }

    MxDocsCtrl.CheckFiles = function (data) {
        if (typeof cordova !== 'undefined' && data.length) {
            angular.forEach(data, function (item) {
                var str = item.url;
                var fileName = str.substring(str.lastIndexOf("/") + 1, str.length);
                item.isDownloaded = false;

                $cordovaFile.checkFile(MxDocsCtrl.targeDirectory + "MxDocs/" + item.fleet + "/", fileName)
                    .then(function (data) {
                        data.file(function (file) {
                            item.isDownloaded = MxDocsCtrl.CompareFileDates(new Date(file.lastModifiedDate), new Date(item.lastupdated));
                        });
                    }, function (error) {
                        item.isDownloaded = false;
                    });
            });
            mxDocsService.hideLoading();
            return data;
        } else {
            mxDocsService.hideLoading();
            return data;
        }
    };

    MxDocsCtrl.CompareFileDates = function (localDate, serverDate) {
        if (localDate >= serverDate) {
            return true;
        } else {
            return false;
        }
    };

    MxDocsCtrl.ChangeType = function (type) {
        MxDocsCtrl.FileFilter.fleet = "";
        MxDocsCtrl.TypeFilter.type = type;
    };

    MxDocsCtrl.callbackSuccess = function (data) {
        MxDocsCtrl.GetData();
    };

    MxDocsCtrl.callbackError = function (error) {
        mxDocsService.hideLoading();
        MxDocsCtrl.isCheckedOut = false;
        $scope.$apply();
    };

    MxDocsCtrl.closeApp = function () {
        window.MmxPlugin.closeApp("", function () { }, function () { });
    };

    $scope.$on('docs:changed', function (event, args) {
        MxDocsCtrl.list = MxDocsCtrl.CheckFiles($localStorage.Docs);
    });

    if (typeof cordova !== "undefined") {
        document.addEventListener('deviceready', function () {
            mxDocsService.showLoading("Loading Files ...");
            if (device.platform === 'android') {
                window.MmxPlugin.getAuth("", MxDocsCtrl.callbackSuccess, MxDocsCtrl.callbackError);
            } else {
                MxDocsCtrl.isCheckedOut = true;
                MxDocsCtrl.GetData();
            }
        });
    } else {
        MxDocsCtrl.isCheckedOut = true;
        MxDocsCtrl.GetData();
    }
});