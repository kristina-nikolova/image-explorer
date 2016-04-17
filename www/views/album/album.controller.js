(function () {
    'use strict';

    angular.module('album', [])
        .controller('AlbumCtrl', AlbumCtrl)

    AlbumCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$ionicModal', 'DatabaseService', 'DatabasePhotoTableService', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$cordovaSocialSharing'];

    function AlbumCtrl ($rootScope, $scope, $state, $stateParams, $ionicModal, DatabaseService, DatabasePhotoTableService, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaSocialSharing) {

        $scope.isAlbumInEditMode = false;
        $scope.isAlbumInDeleteMode = false;
        $scope.currentSlideIndex = 0;
        $scope.zoomMin = 1;

        function init() {
            $scope.album = DatabaseService.getAlbumById($stateParams.albumId);
            DatabasePhotoTableService.selectAllFilesInAlbum($stateParams.albumId);
        }

        $scope.$on('allFilesInAlbum:Loaded', function (event, data) {
            $scope.files = DatabaseService.albumFiles;

        });

        $scope.enterInEditMode = function(){
            $scope.isAlbumInEditMode = true;
        }

        $scope.enterInDeleteMode = function(){
            $scope.isAlbumInDeleteMode = true;
        }

        $scope.exitFromEditDeleteMode = function(){
            if($scope.isAlbumInEditMode || $scope.isAlbumInDeleteMode) {
                $scope.isAlbumInEditMode = false;
                $scope.isAlbumInDeleteMode = false;
            }
        }

        $scope.goToAddFilePage = function(){
            $rootScope.isAlbumViewPrevSate = true;
            $rootScope.currentAlbum = $scope.album;
            $state.go('tab.photo');
        }

        $scope.editPhotoDetails = function(file) {
            $state.go('tab.photo-details', { file: file });
        };

        $scope.deleteFile = function(file) {
            DatabasePhotoTableService.deleteFileById(file);
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

        $scope.shareToEmail = function() {

            var message = 'Message via Email',
                subject = null,
                toArr = null,
                ccArr = null,
                bccArr = null,
                file = [$scope.file.url];

            $cordovaSocialSharing
                .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)
                .then(function(result) {
                    console.log(result);
                }, function(err) {
                    console.log(err);
                });
        }

        $scope.shareToFacebook = function() {

            var message = 'Message via Facebook',
                image = [$scope.file.url],
                link = null;

            $cordovaSocialSharing
                .shareViaFacebook(message, image, link)
                .then(function(result) {
                    console.log(result);
                }, function(err) {
                    console.log(err);
                });
        }

        $scope.shareToTwitter = function() {

            var message = 'Message via Twitter',
                image = [$scope.file.url],
                link = null;

            $cordovaSocialSharing
                .shareViaTwitter(message, image, link)
                .then(function(result) {
                    console.log(result);
                }, function(err) {
                    console.log(err);
                });
        }

        $scope.shareExternal = function() {

            var message = 'Message',
                subject =  null,
                file = [$scope.file.url],
                link = null;

            $cordovaSocialSharing
                .share(message, subject, file, link)
                .then(function(result) {
                    console.log(result);
                }, function(err) {
                    console.log(err);
                });
        }

        init();
    }

})();