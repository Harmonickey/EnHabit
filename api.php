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
else if (isset($_POST["data_register"]))
{
	$data = $_POST["data_register"];
	
	$data = remove_malicious_characters($data);
	
	echo shell_exec("ruby register.rb '$data'");
}

function remove_malicious_characters($data)
{
	//blacklist all characters that could be used for shell injection
	$blacklist = ["|", "$", "&", ";", "<", ">", "`"];

	for ($i = 0; $i < count($blacklist); $i++)
	{
		$data = str_replace($blacklist[$i], "", $data);
	}

	//escape all other characters that PHP deems could be used for shell injection
	//these get unescaped in the ruby code once it gets passed safely
	$data = escapeshellcmd($data);
	
	return $data;
}

?>