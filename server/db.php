<?php
$mysqli = new mysqli('localhost', 'root', '123456789a', 'real-time-chat');

$config = json_decode(file_get_contents(__DIR__.'/../config.json'));
$full_ws_url = $config->websocket->host.':'.$config->websocket->port;
$full_ws_server = $config->websocket->ws_protocol.$full_ws_url;
$full_ht_server = $config->websocket->http_protocol.$full_ws_url;
?>