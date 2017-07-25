(function(){

	angular
		.module('app')
		.directive('scene', scene);

	function scene() {

		var directive = {
			scope: {
				tasks: "=",
				refreshTasks: "&"
			},
			templateUrl: 'scripts/components/scene/sceneView.html',
			restrict: 'E'
		}

		return directive;
	}

})();