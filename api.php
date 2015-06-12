<?php

if (isset($_POST["data_query"]))
{

	$data = $_POST["data_query"];

	$data = remove_malicious_characters($data);

	echo shell_exec("ruby web-service.rb '$data'");
}
else if (isset($_POST["data_login"]))
{
	
	$data = $_POST["data_login"];
	
	$data = remove_malicious_characters($data);
	
	echo shell_exec("ruby login.rb '$data'");
}

function remove_malicious_characters($data)
{
	//blacklist all shell characters that could be used for shell injection
	$blacklist = ["|", "$", "&", ";", "<", ">", "`"];

	for ($i = 0; $i < count($blacklist); $i++)
	{
		$data = str_replace($blacklist[$i], "", $data);
	}

	//escape all other characters that PHP deems could be used for shell injection
	$data = escapeshellcmd($data);
	
	return $data;
}

?>