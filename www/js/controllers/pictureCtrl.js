﻿'use strict';
angular.module('checkout').controller('pictureCtrl', ['$scope', '$cordovaCamera', '$cordovaFileTransfer', 'configSvc', 'pictureSvc', pictureCtrl]);

function pictureCtrl($scope, $cordovaCamera, $cordovaFileTransfer, configSvc, pictureSvc) {

    var server = configSvc.appUrl;

    var uploadOptions = {
        fileKey: "avatar",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/jpg"
    };

    $scope.takePicture = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            //popOverOptions: CameraPopoverOptionsselectPicture
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var image = {};
            image.data = imageData;
            pictureSvc.uploadDisplayPic(image).then(function (response) {
                $scope.imgSrc = "data:image/jpeg;base64," + response.imageData;
                console.log("image Saved");
            }, function (error) {
                console.log("image error " + error);
            });
        }, function (err) {
            alert("Error occured while taking picture - " + err);
        });
    };

    $scope.selectPicture = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popOverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageUri) {
            $cordovaFileTransfer.upload(server + "/api/postUserPic", "../../img/ionic.png", uploadOptions).then(function (result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
            }, function (err) {
                console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
        });
    };

    $scope.uploadFile = function (files) {
        pictureSvc.uploadDisplayPic(files).then(function (response) {
            console.log("success");
        },
        function (err) {
            console.log("Error occured while uploading picture " + err);
        });
    };

    var getPicture = function () {
        pictureSvc.getDisplayPic().then(function (response) {
            console.log("success");
            $scope.imgSrc = response;
        },
        function (err) {
            console.log("Error occured while getting picture " + err);
        });
    };

    getPicture();

}