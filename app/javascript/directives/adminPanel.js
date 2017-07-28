/**
 * Angular Network graph directive.
 *
 * @description: A directive to display a graph of a costume.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularAdminPanelDirective($log, dbREST) {

    function link (scope, element, attr) {


        scope.users = [];
        scope.newUser = {
            username: undefined,
            password: undefined,
            isEditor: true,
            isTaxonomyAdmin: false,
            isAdmin: false,
        };

        function reloadUserTable() {
            dbREST.Users.query().$promise.then(function (users) {
                scope.users = [];
                users.forEach(function (user) {
                    var roles = user.Roles.split(',');
                    scope.users.push({
                        username: user.User,
                        password: '',
                        roles: roles,
                        isEditor: roles.indexOf('Editor') >= 0,
                        isTaxonomyAdmin: roles.indexOf('TaxAdmin') >= 0,
                        isAdmin: roles.indexOf('Admin') >= 0,
                    });
                });
            });
        }

        reloadUserTable();


        scope.addUser = function () {
            var body = {
                password: scope.newUser.password,
                roles: ['User']
            };
            if (scope.newUser.isEditor) {
                body.roles.push('Editor');
            }
            if (scope.newUser.isTaxonomyAdmin) {
                body.roles.push('TaxAdmin');
            }
            if (scope.newUser.isAdmin) {
                body.roles.push('Admin');
            }
            dbREST.User.save({username: scope.newUser.username}, body, function (success) {
                // all wen't good
                scope.newUser = {
                    username: undefined,
                    password: undefined,
                    isEditor: true,
                    isTaxonomyAdmin: false,
                    isAdmin: false,
                };
                reloadUserTable();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };

        scope.deleteUser = function (username) {
            dbREST.User.delete({username: username}, function (success) {
                reloadUserTable();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };


        scope.updateEditRights = function (user) {
            if (user.isEditor) {
                dbREST.UserRoles.save({username: user.username, role: 'Editor'}, {}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            } else {
                dbREST.UserRoles.delete({username: user.username, role: 'Editor'}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            }
        };

        scope.updateTaxonomyEditRights = function (user) {
            if (user.isTaxonomyAdmin) {
                dbREST.UserRoles.save({username: user.username, role: 'TaxAdmin'}, {}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            } else {
                dbREST.UserRoles.delete({username: user.username, role: 'TaxAdmin'}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            }
        };

        scope.updateAdminRights = function (user) {
            if (user.isAdmin) {
                dbREST.UserRoles.save({username: user.username, role: 'Admin'}, {}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            } else {
                dbREST.UserRoles.delete({username: user.username, role: 'Admin'}, function (success) {}, function (htmlStatus) {
                    // something bad happened
                    // FIXME
                    reloadUserTable();
                });
            }
        };


        scope.changePassword = function (user){

            var password = user.password;

            if(password.length == 0) {
                return;
            }

            dbREST.ChangePassword.save({current_password: 'old_pw', new_password: password, username: user.username }, function(value){
                reloadUserTable();
            }, function(error){
                // something bad happened
                // FIXME
            });
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'templates/directives/adminPanel.html',
        scope: {
            username: '@?',
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('adminPanel', ['$log', 'dbREST', AngularAdminPanelDirective]);
