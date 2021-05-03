<?php
include_once 'db.php';
define('WS_SERVER', $full_ht_server);

// get the input
$user = trim(htmlspecialchars($_REQUEST['user'] ?? ''));
$message = trim(htmlspecialchars($_REQUEST['message'] ?? ''));
$medium = trim(htmlspecialchars($_REQUEST['medium'] ?? 'Main Server ('.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].')'));

if(!$user || !$message) die;

// insert data into the database
$stmt = $mysqli->prepare('INSERT INTO messages (user, message, medium) VALUES (?,?,?)');
$stmt->bind_param('sss', $user, $message, $medium);
var_dump($stmt->execute());


// Send the HTTP request to the websockets server (it runs both  HTTP and Websockets)
// (change the URL accordingly)
$ch = curl_init(WS_SERVER);
// It's POST
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

// we send JSON encoded data to the client
$jsonData = json_encode([
	'user' => $user,
	'message' => $message
]);
$query = http_build_query(['data' => $jsonData]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
// Just return the transfer
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// execute
$response = curl_exec($ch);
var_dump($response);
var_dump(curl_error($ch));
// close
curl_close($ch);


// Now real time notification should be sent to all the users

?>