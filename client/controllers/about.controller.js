/* IIFE wrapper */
(function() {
	/**
	 * Declare and add about page controller to the application.
	 */
	angular
		.module('spapp')
		.controller('aboutCtrl', aboutCtrl);
	
	/**
	 * Defines "About" page controller.
	 * Binds some data for header and sidebar.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
//	homeCtrl.$inject = ['$scope', 'dataService'];
	function aboutCtrl() {
		// controller hook, binds controller to the scope (controllerAs)
		var vm = this;

		vm.pageHeader = {
			title: 'About Mean PG'
		};

		vm.main = {
			content: 'Mean PG App was created to help people find places to sit down and get a bit of work done.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem ac nisi dignissim accumsan. Nullam sit amet interdum magna. Morbi quis faucibus nisi. Vestibulum mollis purus quis eros adipiscing tristique. Proin posuere semper tellus, id placerat augue dapibus ornare. Aenean leo metus, tempus in nisl eget, accumsan interdum dui. Pellentesque sollicitudin volutpat ullamcorper.\n\nSuspendisse tincidunt, lectus non suscipit pharetra, purus ipsum vehicula sapien, a volutpat mauris ligula vel dui. Proin varius interdum elit, eu porttitor quam consequat et. Quisque vitae felis sed ante fringilla fermentum in vitae sem. Quisque fermentum metus at neque sagittis imperdiet. Phasellus non laoreet massa, eu laoreet nibh. Pellentesque vel magna vulputate, porta augue vel, dapibus nisl. Phasellus aliquet nibh nec nunc posuere fringilla. Quisque sit amet dignissim erat. Nulla facilisi. Donec in sollicitudin ante. Cras rhoncus accumsan rutrum. Sed aliquet ligula dui, eget laoreet turpis tempor vitae.'
		};
	}
})();