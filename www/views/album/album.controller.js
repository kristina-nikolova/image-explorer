(function () {
    'use strict';

    angular.module('album', [])
        .controller('AlbumCtrl', AlbumCtrl)

    AlbumCtrl.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$ionicModal', 'DatabaseService', 'DatabasePhotoTableService', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$cordovaSocialSharing'];

    function AlbumCtrl ($rootScope, $scope, $state, $timeout, $stateParams, $ionicModal, DatabaseService, DatabasePhotoTableService, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaSocialSharing) {

        var selectedPhotos = [];
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

        $scope.$on('editMode:exit', function () {
            selectedPhotos = [];
            $scope.photos.forEach(function(photo){
                photo.isSelected = false;
            });
        });


        $scope.goToAddPhotoPage = function(){
            $rootScope.isAlbumViewPrevSate = true;
            $rootScope.currentAlbum = $scope.album;
            $state.go('app.photo');
        }

        $scope.onItemClicked = function(photo, photos, isAlbumInEditMode, isAlbumInDeleteMode) {
            if(isAlbumInEditMode) {
                editPhotoDetails(photo);
            } else if(isAlbumInDeleteMode) {
                selectPhoto(photo);
            } else {
                openPhotoSliderModal(photo, photos);
            }
        }

        $scope.deletePhotos  = function() {
            if(selectedPhotos.length) {
                DatabasePhotoTableService.deletePhotos(selectedPhotos);
                return;
            }
        };

        function selectPhoto(photo) {
            if(!photo.isSelected) {
                selectedPhotos.push(photo);
                photo.isSelected = true;
            } else {
                photo.isSelected = false;
                selectedPhotos.splice(selectedPhotos.indexOf(photo), 1);
            }
        };

        function editPhotoDetails(photo) {
            $state.go('app.photo-details', { photo: photo });
        };

        ////Photo Slider

        function openPhotoSliderModal(photo, photos) {
            if(ionic.Platform.isAndroid()) {
                AndroidFullScreen.immersiveMode();
            }
            $timeout(function(){
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
            }, 400);
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
            $scope.photoSliderModal.remove();
            $timeout(function() {
                if (ionic.Platform.isAndroid()) {
                    AndroidFullScreen.showSystemUI();
                }
            }, 400);
        };

        $scope.openPhotoInfoModal = function() {
            $scope.photo = $scope.currentSlide;

            $ionicModal.fromTemplateUrl('views/album/photo-info.modal.template.html', function(modal) {
                $scope.photoInfoModal = modal;
                $scope.photoInfoModal.show();
                if($scope.photo.long && $scope.photo.lat){
                    mapInitialize();
                }
            }, {
                scope: $scope
            });
        };

        $scope.closePhotoInfoModal = function() {
            $scope.photoInfoModal.hide();
            $scope.photoInfoModal.remove();
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

        function mapInitialize() {
            var myLatlng = new google.maps.LatLng($scope.photo.lat, $scope.photo.long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Photo Location'
            });
        }

        init();
    }

})();