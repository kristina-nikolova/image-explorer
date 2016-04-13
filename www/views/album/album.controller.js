(function () {
    'use strict';

    angular.module('album', [])
        .controller('AlbumCtrl', AlbumCtrl)

    AlbumCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$ionicModal', 'DatabaseService', 'AlbumService', '$cordovaEmailComposer', '$ionicSlideBoxDelegate', '$ionicScrollDelegate'];

    function AlbumCtrl ($rootScope, $scope, $state, $stateParams, $ionicModal, DatabaseService, AlbumService, $cordovaEmailComposer, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

        $scope.editModeOn = false;
        $scope.currentSlideIndex = 0;
        $scope.zoomMin = 1;

        function init() {
            $scope.album = DatabaseService.getAlbumById($stateParams.albumId);
            DatabaseService.selectAllFilesInAlbum($stateParams.albumId);
        }

        //TODO: use in one place for edit album/photo!
        $rootScope.$on('state:changed', function(){
            if($scope.editModeOn) {
                $scope.exitFromEditMode();
            }
        });

        $scope.$on('allFilesInAlbum:Loaded', function (event, data) {
            AlbumService.files  = data;
            $scope.files = AlbumService.files;

        });

        $scope.$on('filesInAlbum:Updated', function (event, data) {
            $scope.files = data;
            $scope.$applyAsync();
        });

        $scope.enterInEditMode = function(){
            $scope.editModeOn = true;
        }

        $scope.exitFromEditMode = function(){
            $scope.editModeOn = false;
        }

        $scope.goToAddFilePage = function(){
            $rootScope.isAlbumViewPrevSate = true;
            $rootScope.currentAlbum = $scope.album;
            $state.go('tab.photo');
        }

        $scope.deleteFile = function(file) {
            DatabaseService.deleteFileById(file);
            return;
        };

        ////Photo Slider

        $scope.openFileSliderModal = function(file, files) {
            if(ionic.Platform.isAndroid()) {
                AndroidFullScreen.immersiveMode();
            }
            $ionicModal.fromTemplateUrl('views/album/photo-slider.modal.template.html', function(modal) {
                $scope.fileSliderModal = modal;

                $scope.currentSlide = file;
                files.map(function(item, index){
                    if (item.id == file.id) {
                        $scope.currentSlideIndex = index;
                        return;
                    }
                });

                $scope.fileSliderModal.show();
            }, {
                scope: $scope
            });
        };

        $scope.slideHasChanged  = function(index) {
            $scope.files.map(function(item, i){
                if (i == index) {
                    $scope.currentSlide = item;
                    return;
                }
            });
        }

        $scope.updateSlideStatus = function(slide) {
            var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
            if (zoomFactor == $scope.zoomMin) {
                $ionicSlideBoxDelegate.enableSlide(true);
            } else {
                $ionicSlideBoxDelegate.enableSlide(false);
            }
        };

        $scope.closeFileSliderModal = function() {
            $scope.fileSliderModal.hide();
            if(ionic.Platform.isAndroid()) {
                AndroidFullScreen.showSystemUI();
            }
        };

        $scope.openPhotoInfoModal = function() {
            $scope.file = $scope.currentSlide;

            $ionicModal.fromTemplateUrl('views/album/photo-info.modal.template.html', function(modal) {
                $scope.fileInfoModal = modal;
                $scope.fileInfoModal.show();
            }, {
                scope: $scope
            });
        };

        $scope.closePhotoInfoModal = function() {
            $scope.fileInfoModal.hide();
        };

        $scope.sharePhoto = function() {
            //window.open("mailto:?subject=Something to share with you...");

//            var bodyText = "<h2>Look at this image!</h2>";
//            var images = [];
//            images.push("" + $scope.file.url);
//            images[0] = images[0].replace('file://', '');
//
//            cordova.plugins.email.isAvailable(
//                function (isAvailable) {
//                    console.log("it is available");
//                }
//            );
//
//            cordova.plugins.email.open({
//                    //app:         "gmail",
//                    to:          ["kristina.g.nikolova@gmail.com"],
//                    cc:          ["kristina.g.nikolova@gmail.com"],
//                    //bcc:         Array, // email addresses for BCC field
//                    attachments: images, // file paths or base64 data streams
//                    subject:    "Just some images", // subject of the email
//                    body:       bodyText, // email body (for HTML, set isHtml to true)
//                    isHtml:    true // indicats if the body is HTML or plain text
//                }, function () {
//                    console.log('email view dismissed');
//                },
//                this);



//            $cordovaEmailComposer.isAvailable().then(function() {
//                console.log('available');
//            }, function () {
//                console.log('not available');
//            });
//
//            var email = {
//                to: 'kristina.g.nikolova@gmail.com',
//                cc: 'kristina.g.nikolova@gmail.com',
//                //bcc: ['john@doe.com', 'jane@doe.com'],
////                attachments: [
////                    'file://img/logo.png',
////                    'res://icon.png',
////                    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
////                    'file://README.pdf'
////                ],
//                subject: 'Cordova Icons',
//                body: 'How are you? Nice greetings from Leipzig',
//                isHtml: true
//            };
//
//            $cordovaEmailComposer.open(email).then(null, function () {
//                // user cancelled email
//                console.log('email is open');
//            });
        }

        init();
    }

})();