<?php
session_start();
require_once 'server/db.php';
function enter_user_form() {
	global $config;
	if(isset($_POST['submit']) && $_POST['user']) {
		$_SESSION['user'] = trim($_POST['user']);
		header('location: '.$config->php_server->url);
	}
	$h = '';
	$h .= '<form method="post">';
	$h .= '<input type="text" class="text-box" name="user" placeholder="Your User">';
	$h .= '<button type="submit" class="button" name="submit">LOGIN</button>';
	$h .= '</form>';
	return $h;
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Real-Time Chat App using PHP, JavaScript & Node.js</title>
	<style type="text/css">
		* {
			box-sizing:border-box;
		}
		#content {
			width:600px;
			max-width:100%;
			margin:30px auto;
			background-color:#fafafa;
			padding:20px;
			border-radius:5px;
		}
		#message-box {
			min-height:400px;
			height:400px;
			max-height:400px;
			overflow:auto;
			border:1px solid #ccc;
			border-radius:7px;
			padding:10px;
			margin-bottom:10px;
		}
		.author {
			margin-right:5px;
			font-weight:600;
		}
		.text-box {
			width:100%;
			border:1px solid #eee;
			padding:10px;
			margin-bottom:10px;
		}
		.button {
			border:1px solid #eee;
			padding: 7px 14px;
			margin-bottom:10px;
			cursor: pointer;
		}
		.color-red {
			color: red;
		}
		.color-green {
			color: green;
		}
		.color-orange {
			color: orange;
		}
		.hidden {
			display: none;
		}
	</style>
</head>
<body>
<div id="content">
	<div id="not-logged-in">
		<?php
		if(!$_SESSION['user']) die(enter_user_form().'</div></div></body></html>');
		?>
	</div>
	<div id="logged-in">
		<p>Latest 20 messages.</p>
		<div id="message-box">
			<?php
			$result = $mysqli->query('
				SELECT * FROM (
					SELECT idx, user, message, creation_time FROM messages ORDER BY idx DESC LIMIT 20
				) tmp ORDER BY idx ASC
			');
			foreach($result as $row):
			?>
				<div>
					<span class="author"><?= ($row['user']===$_SESSION['user'] ? '<u>'.$row['user'].'</u>' : $row['user']) ?>:</span>
					<span class="messsage-text"><?= $row['message'] ?></span>
				</div>	
			<?php endforeach; ?>	
		</div>
		<div id="connecting"><span class="color-orange">[*] Connecting to the web socket server...</span></div>
		<input type="hidden" class="text-box" id="user-input" placeholder="Your User" onkeyup="handleKeyUp(event);" value="<?php echo $_SESSION['user'];?>">
		<input type="text" class="text-box" id="message-input" placeholder="Your Message" onkeyup="handleKeyUp(event);" value="">
		<button type="button" class="button" id="send-button" onclick="sendMessage();">SEND</button>
		<p><i>Click on 'SEND' button or press 'Enter' to send the message.</i></p>
	</div>
</div>
<script type="text/javascript">
const WS_SERVER = '<?php echo $full_ws_server;?>';
</script>
<script type="text/javascript" src="index.js"></script>
</body>
</html>