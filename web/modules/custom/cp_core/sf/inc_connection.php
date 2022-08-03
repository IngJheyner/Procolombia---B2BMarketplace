<?php
	include_once (drupal_get_path('module', 'cp_core') . '/sf/inc_config.php');
	//ini_set('soap.wsdl_cache_enabled', 0);
	//ini_set('soap.wsdl_cache_ttl', 0);

	//Create a new Salesforce Partner object
	$connection = new SforcePartnerClient();

	//Create the SOAP connection to Salesforce
	$connection1 = $connection->createConnection(salesforce_wsdl);

	//Pass login details to Salesforce
	$mylogin = $connection->login(salesforce_username, salesforce_password.salesforce_token);

?>
