// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var MxDox;
(function (MxDox) {
    var Cordova;
    (function (Cordova) {
        "use strict";
        var Application;
        (function (Application) {
            function initialize() {
                document.addEventListener('deviceready', onDeviceReady, false);
            }
            Application.initialize = initialize;
            function onDeviceReady() {
                // Handle the Cordova pause and resume events
                document.addEventListener('pause', onPause, false);
                document.addEventListener('resume', onResume, false);
                // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
                document.getElementById("clickphoto").onclick = function () {
                    navigator.camera.getPicture(function (ImageUrl) {
                        var photoconatiner = document.getElementById('massphoto');
                        alert('loading photo');
                        photoconatiner.innerHTML = '<img src=' + ImageUrl + ' style="width:75%" />';
                    }, null, null);
                };
                document.getElementById("DownloadFileId").onclick = function () {
                    var fileTransfer = new FileTransfer();
                    var uri = encodeURI("https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/index.html");
                    var fileURL = cordova.file.applicationStorageDirectory + '/index.html';
                    alert(fileURL);
                    fileTransfer.download(uri, fileURL, function (entry) {
                        console.log("download complete: " + entry.toURL());
                    }, function (error) {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("upload error code" + error.code);
                    }, false, false);
                };
            }
            function onPause() {
                // TODO: This application has been suspended. Save application state here.
            }
            function onResume() {
                // TODO: This application has been reactivated. Restore application state here.
            }
        })(Application = Cordova.Application || (Cordova.Application = {}));
        window.onload = function () {
            Application.initialize();
        };
    })(Cordova = MxDox.Cordova || (MxDox.Cordova = {}));
})(MxDox || (MxDox = {}));
//# sourceMappingURL=appBundle.js.map