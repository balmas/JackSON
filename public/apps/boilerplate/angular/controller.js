app.controller("controller", function( $scope, json, sparql ){
	
	// Configuration
	$scope.config = {
		domain: location.protocol+'//'+location.hostname+(location.port ? ':' + location.port: '' ),
		app: 'boilerplate'
	}
	$scope.config.query = $scope.config.domain+'/query';
	
	// UI input
    $scope.form = {
    	name:'',
		symbol:'',
		weight:'',
		number:''
    };

	// What is saved to the JackSON server
    $scope.data = save_data();
	
	// The path of the specific JSON file
	$scope.path = "default"
	
	// Pretty print data for browser viewing
	$scope.pretty = pretty();
	$scope.std_out = "";
	$scope.app_root = app_root();
	$scope.save_dir = save_dir();
	$scope.save_url = save_url();
	
	// Search
	$scope.search = query();
	
	// Messages
	$scope.msg = "Welcome!";

	// Save the data
	$scope.save = function() {
		save();
	}
	
	// Run a JackSON command on the data root
	$scope.cmd = function( cmd ) {
		ls();
		return
		switch( cmd ) {
			case 'ls':
				ls( json );
				break;
		}
	}
	
	// Open saved data on load
	$scope.open = function() {
		open();
	}
	$scope.open();
	
	// Form id provides the path name
	$scope.form_id = function(e) {
		$scope.path = $scope.form[e].file_name();
		$scope.form_item();
		$scope.refresh();
	}
	
	// Update schtuff
	$scope.refresh = function() {
		$scope.save_url = save_url();
		$scope.search = query();
	}
	
	// Apply form data
	$scope.form_item = function() {
		apply_form();
	}
	
	// Take JSON data and apply it to the form
	$scope.data_to_form = function() {
		for ( var key in $scope.data ) {
			if ( key == '@context' ) { continue }
			$scope.form[key] = $scope.data[key]
		}
	}
	
	// Sparql query
	$scope.query = function() {
		sparql.search( $scope ).then(
			function( data ) {
				$scope.sparql_json = angular.toJson( data, true );
			}
		);
	}
	
	// Clear form
	$scope.form_clear = function() {
		for ( var key in $scope.form ) {
			$scope.form[key] = '';
		}
		apply_form();
	}
	
	// Save JSON data to JackSON server
	function save_data() {
		return { 
			"@context": {
				"name": app_root()+"/schema#name",
				"symbol": app_root()+"/schema#symbol",
				"weight": app_root()+"/schema#weight",
				"number": app_root()+"/schema#number",
			},
			"name": $scope.form.name,
			"symbol": $scope.form.symbol,
			"weight": $scope.form.weight,
			"number": $scope.form.number,
		};
	}
	
	// Save a JSON file
	function save() {
		apply_for();
		$scope.refresh();
		json.post( $scope ).then(
			function( msg ) { 
				$scope.msg = msg;
			}
		)
	}
	
	// Open a JSON file
	function open() {
		json.get( $scope ).then(
			function( data ) {
				$scope.data = data;
				$scope.data_to_form();
				$scope.form_item();
				$scope.refresh();
			}
		)
	}
	
	// Run the ls command on save_dir()
	function ls() {
		json.ls( $scope ).then(
			function( data ) {
				$scope.std_out = angular.toJson( data, true );
			}
		)
	}
	
	// Retrieve the form's data
	function apply_form() {
		$scope.data = save_data();
		$scope.pretty = pretty();
	}
	
	function pretty() {
		return angular.toJson( $scope.data, true );
	}
	
	// Return this application's root url
	function app_root() {
		return document.URL.replace(/\/$|\/index\.html.*/,'');
	}
	
	// Return the data url for the app
	function save_dir() {
		var c = $scope.config
		return c.domain+'/data/'+c.app;
	}
	
	// Get the JackSON server save url
	function save_url() {
		return save_dir()+'/'+$scope.path;
	}
	
	// Dynamic SPARQL query
	function query() {
		return "SELECT ?p ?o WHERE { <"+save_url()+"> ?p ?o }"
	}
});