/**
 * Created by falkenml on 17.02.2015.
 */

'use strict';

    angular.module('MUSE').controller('LoginCtrl', function LoginCtrl($rootScope, $scope, dbREST, AuthTokenFactory, $window) {
        'use strict';

        //Functions
        $scope.login = login;
        $scope.logout = logout;
        $scope.changePassword = changePassword;

        //Constants
        $scope.user = "";

        //Input Variables
        $scope.username= "";
        $scope.password = "";
        $scope.current_password= "";
        $scope.new_password = "";
        $scope.new_password2 = "";

        //UI Variables
        $scope.password_success=false;
        $scope.error=false;
        $scope.password_error=false;


        // initialization
        getUser();

        function login(username, password) {
            if((username || password) === null || username.length == 0 || password.length == 0)
            {
                $scope.error = true;
                return;
            }

            dbREST.Login.save({username: username, password: password}, function(value)  {
                AuthTokenFactory.setToken(value.token);
                $scope.user = value.user;
                $rootScope.loggedIn = true;
                setTimeout(function(){$window.location.reload();}, 500);
            }, function(error)
            {
                $scope.error = true;
            });
        }

        function logout() {
            AuthTokenFactory.setToken();
            $scope.user = null;
            resetPasswordValues();
            resetLoginValues();
            $scope.error = false;
            $scope.password_error = false;
            $scope.password_success= false;
            $rootScope.loggedIn = false;
        }

        function changePassword(current_password, new_password, new_password2){

            if((current_password || new_password || new_password2) === null || current_password.length == 0 || new_password.length == 0 || new_password2.length == 0)
            {
                $scope.password_error = true;
                $scope.password_success = false;
                return;
            }

            var a = new_password;
            var b = new_password2;

            if(a != b){
                $scope.password_error = true;
                $scope.password_success = false;
                return
            }
            dbREST.ChangePassword.save({current_password: current_password, new_password: new_password, username: $scope.user.username }, function(value){

                $scope.password_error = false;
                $scope.password_success= true;
                setTimeout(function(){logout()}, 3000);
                setTimeout(function(){$window.location.reload();}, 3500);

            }, function(error){

                $scope.password_error = true;
                $scope.password_success= false;
            });
        }

        function getUser() {
            if (AuthTokenFactory.getToken()) {
                dbREST.Loggedin.get({}, function (value) {
                    $scope.user = value;
                    $rootScope.loggedIn = true;
                });
            }
        }

        function resetLoginValues(){
            $scope.username= "";
            $scope.password = "";
        }

        function resetPasswordValues(){
            $scope.current_password= "";
            $scope.new_password = "";
            $scope.new_password2 = "";
        }

        //Wenn die Seite verlassen wird, resette die scopes
        $scope.$on('$locationChangeStart', function() {
            resetPasswordValues();
            $scope.password_success=false;
            $scope.error=false;
            $scope.password_error=false;
        });



    });


