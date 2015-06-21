<?php

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