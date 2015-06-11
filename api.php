<?php

$data = $_POST["data"];

//blacklist all shell characters that could be used for shell injection
$blacklist = ["|", "$", "&", ";", "<", ">", "`"];

for ($i = 0; $i < count($blacklist); $i++)
{
	$data = str_replace($blacklist[$i], "", $data);
}

//escape all other characters that PHP deems could be used for shell injection
$data = escapeshellcmd($data);

echo shell_exec("ruby web-service.rb '$data'");

?>