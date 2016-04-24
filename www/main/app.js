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
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob|cdvfile|content):|data:image\//);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'main/menu.template.html',
    controller: 'MainCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'appContent': {
        templateUrl: 'views/dashboard/dashboard.template.html',
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.albums', {
      url: '/albums',
      views: {
        'appContent': {
          templateUrl: 'views/albums/albums.template.html',
          controller: 'AlbumsCtrl'
        }
      }
    })
    .state('app.album', {
      url: '/albums/:albumId',
      views: {
        'appContent': {
          templateUrl: 'views/album/album.template.html',
          controller: 'AlbumCtrl'
        }
      }
    })

  .state('app.settings', {
    url: '/settings',
    views: {
      'appContent': {
        templateUrl: 'views/settings/settings.template.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  
  .state('app.photo', {
    url: '/photo',
    views: {
      'appContent': {
        templateUrl: 'views/photo-uploading/photo.template.html',
        controller: 'PhotoCtrl'
      }
    }
  })
  .state('app.photo-details', {
      url: '/photo-details',
      views: {
          'appContent': {
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
  $urlRouterProvider.otherwise('/app/dashboard');

});
