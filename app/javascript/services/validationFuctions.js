/**
 * Created by michaelfalkenthal on 12.11.14.
 */
'use strict';


angular.module('MUSE').factory('ValidationFunctions', function (){

    function arrayLengthGTZero(newValue, oldValue){
        if(angular.isArray(newValue)){
            return newValue.length > 0;
        }else{
            return false;
        }
    }

    function stringNotEmpty(newValue, oldValue){
        if(newValue){
            return newValue !== '';
        }else{
            return false;
        }
    }

    function isPositiveValue(newValue, oldValue){
        if(newValue){
            return angular.isNumber(newValue) && newValue > 0 ? true : false;
        }else{
            return false;
        }
    }

    var obj = {
        ArrayLengthGTZero: arrayLengthGTZero,
        StringNotEmpty: stringNotEmpty,
        isPositiveValue: isPositiveValue
    };
    return obj;
});