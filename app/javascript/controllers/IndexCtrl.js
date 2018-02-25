/**
 * Created by falkenml on 11.03.2015.
 */
angular.module('MUSE').controller('IndexCtrl',['$scope', '$rootScope', '$location', 'dbREST', 'AuthTokenFactory', function( $scope, $rootScope, $location, dbREST, AuthTokenFactory) {

    $scope.modalErrorMessage = "";
    //default menu item
    $scope.menuActive = '/';

    /**
     * Menu items for index header. labels will be populated with ng-repeat
     * @type {*[]}
     */
    $scope.menu = [
        {label:'FILMUEBERSICHT', route:'/filmuebersicht'},
        {label:'GENREUEBERSICHT', route:'/genreuebersicht'},
        {label:'SUCHEN', route:'/search'},
        {label:'ANALYSIS', route:'/analysis'},
        {label:'TAXONOMIES', route:'/taxonomies'},
        {label:'LOGIN', route:'/login'}
    ];

    /**
     * Initial User Status Check to set the Login Route to Logout if a user is logged in
     */
    function checkLoginStatus() {
        if (AuthTokenFactory.getToken()) {
            dbREST.Loggedin.get({}, function (value) {
                $rootScope.user = value;
                $rootScope.loggedIn = true;
            });
        }
    }

    // run the Method on first start
    checkLoginStatus();

    /**
     * $watch method for global errors. The method listens on $rootScope "states.error" events.
     * If the value is changed, the errorModal from templates/modal/errorModal.html will be shown
     */
        $rootScope.$watch("states.error", function () {
            $scope.modalErrorMessage = $rootScope.states.errorMessage;
            $(document).ready(function(){
            $('#errorModal').modal({
                show: true
            });});
        });

    /**
     * Reset the global RootScope Error Values
     */
    $scope.cleanErrorMessage = function(){
        $rootScope.states.error = false;
        $rootScope.states.errorMessage = "";
    };

    /**
     * Listener on $location.path. If the route is changed, save this route in $menuActive
     */
    $rootScope.$on('$routeChangeSuccess', function() {
        $scope.menuActive = $location.path();
    });

    /**
     * Watcher for the login label. If a user isn't logged in, show LOGIN label. Else show LOGOUT label
      */
    $rootScope.$watch("loggedIn", function() {
        if ($rootScope.loggedIn == true) {
            for (var i=0; i<$scope.menu.length; i++) {
                if ( $scope.menu[i].label == 'LOGIN' ) {
                    $scope.menu[i].label = 'LOGOUT';
                    break;
                }        }        }
        if ($rootScope.loggedIn == false)
        {
            for (var j=0; j<$scope.menu.length; j++) {
                if ( $scope.menu[j].label == 'LOGOUT' ) {
                    $scope.menu[j].label = 'LOGIN';
                    break;
                }
            }
        }});
}]);
