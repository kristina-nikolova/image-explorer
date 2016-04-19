angular.module('imageExplorer', [
    'ionic',
    'ngCordova',
    'directives',
    'main',
    'camera',
    'photo-location',
    'database',
    'dashboard',
    'photo',
    'photo-details',
    'album',
    'albums',
    'settings'
])

.run(function($rootScope, $state, $ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

})

.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'main/tabs.template.html',
    controller: 'MainCtrl'
  })

  .state('tab.dashboard', {
    url: '/dashboard',
    views: {
      'tab-dashboard': {
        templateUrl: 'views/dashboard/dashboard.template.html',
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('tab.albums', {
      url: '/albums',
      views: {
        'tab-albums': {
          templateUrl: 'views/albums/albums.template.html',
          controller: 'AlbumsCtrl'
        }
      }
    })
    .state('tab.album', {
      url: '/albums/:albumId',
      views: {
        'tab-albums': {
          templateUrl: 'views/album/album.template.html',
          controller: 'AlbumCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'views/settings/settings.template.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  
  .state('tab.photo', {
    url: '/photo',
    views: {
      'tab-photo': {
        templateUrl: 'views/photo-uploading/photo.template.html',
        controller: 'PhotoCtrl'
      }
    }
  })
  .state('tab.photo-details', {
      url: '/photo-details',
      views: {
          'tab-photo': {
              templateUrl: 'views/photo-uploading/photo-details.template.html',
              controller: 'PhotoDetailsCtrl'
          }
      },
      cache: false,
      params: {
        photo: null
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dashboard');

});
