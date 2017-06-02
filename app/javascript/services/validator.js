/**
 * Created by michaelfalkenthal on 12.11.14.
 */
'use strict';


angular.module('MUSE').factory('ValidationService', function (){
    var Validator = function(){
        var validationConstraints = {};
        var validation = {
            valid: false
        };
        var watchStopFunctions = [];

        function validate(){
            validation.valid = true;
            for(var key in validationConstraints){
                if(validationConstraints.hasOwnProperty(key)){
                    if(!validationConstraints[key].valid){
                        validation.valid = false;
                        break;
                    }
                }
            }
        }

        this.addValidationConstraint = function(scope, watchVarName, valFunc){
            if(!validationConstraints[watchVarName]){
                var validationConstraint = {
                    scope: scope,
                    watchVarName: watchVarName,
                    valFunc: valFunc,
                    watchStopFunction: {},
                    valid: false
                };
                validationConstraint.watchStopFunction = scope.$watch(watchVarName, function(newValue, oldValue){
                    validationConstraint.valid = valFunc(newValue, oldValue);
                    validate();
                });
                validationConstraints[watchVarName] = validationConstraint;
            }
            return validationConstraints[watchVarName];
        };
        this.stopAllWatches = function(){
            for(var key in validationConstraints){
                if(validationConstraints.hasOwnProperty(key)){
                    var vs = validationConstraints[key];
                    vs.watchStopFunction();
                }
            }
        };
        this.getNewInstance = function(){
            return new Validator();
        };
        this.validationResult = validation;
        this.validationConstraints = validationConstraints;
    };

    return new Validator();
});