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
            DatabasePhotoTableService.selectAllPhotosInAlbum($stateParams.albumId);
        }

        $scope.$on('allPhotosInAlbum:Loaded', function (event, data) {
            $scope.photos = DatabaseService.albumPhotos;

        });

        $scope.goToAddPhotoPage = function(){
            $rootScope.isAlbumViewPrevSate = true;
            $rootScope.currentAlbum = $scope.album;
            $state.go('tab.photo');
        }

        $scope.editPhotoDetails = function(photo) {
            $state.go('tab.photo-details', { photo: photo });
        };

        $scope.deletePhoto = function(photo) {
            DatabasePhotoTableService.deletePhotoById(photo);
            return;
        };

        ////Photo Slider

        $scope.openPhotoSliderModal = function(photo, photos) {
            if(ionic.Platform.isAndroid()) {
                AndroidFullScreen.immersiveMode();
            }
            $ionicModal.fromTemplateUrl('views/album/photo-slider.modal.template.html', function(modal) {
                $scope.photoSliderModal = modal;

                $scope.currentSlide = photo;
                photos.map(function(item, index){
                    if (item.id == photo.id) {
                        $scope.currentSlideIndex = index;
                        return;
                    }
                });

                $scope.photoSliderModal.show();
            }, {
                scope: $scope
            });
        };

        $scope.slideHasChanged  = function(index) {
            $scope.photos.map(function(item, i){
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

        $scope.closePhotoSliderModal = function() {
            $scope.photoSliderModal.hide();
            if(ionic.Platform.isAndroid()) {
                AndroidFullScreen.showSystemUI();
            }
        };

        $scope.openPhotoInfoModal = function() {
            $scope.photo = $scope.currentSlide;

            $ionicModal.fromTemplateUrl('views/album/photo-info.modal.template.html', function(modal) {
                $scope.photoInfoModal = modal;
                $scope.photoInfoModal.show();
            }, {
                scope: $scope
            });
        };

        $scope.closePhotoInfoModal = function() {
            $scope.photoInfoModal.hide();
        };

        $scope.shareToEmail = function() {

            var message = 'Message via Email',
                subject = null,
                toArr = null,
                ccArr = null,
                bccArr = null,
                file = [$scope.photo.url];

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
                image = [$scope.photo.url],
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
                image = [$scope.photo.url],
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
                file = [$scope.photo.url],
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