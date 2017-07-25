/**
 * Created by alexturin on 7/18/17.
 */
(function(){

    angular
        .module('app')
        .directive('computerVision', computerVision);

    function computerVision() {

        var directive = {
            scope: false,
            templateUrl: 'scripts/components/scene/computerVisionView.html',
            restrict: 'E'
        }

        return directive;
    }

})();