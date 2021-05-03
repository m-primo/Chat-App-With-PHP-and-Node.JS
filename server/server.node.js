const wsconfig = require('../config.json').websocket;
const WS_HOST = wsconfig.host;
const WS_PORT = wsconfig.port;

// Express App
// No need to use.. 
// const express = require('express');
// const app = express();
// app.get('/', (req, res) => res.send('Hello World!'));
// app.get('/login', (req, res) => res.sendFile(__dirname+'/templates/login.html'));
// app.get('/messages/get', (req, res) => res.send('Mess!'));
// use this listen
// app.listen(WS_PORT, () => console.log(`Express app listening on host: ${WS_HOST}, port: ${WS_PORT}!`));
// or this listen
// const http = require('http').Server(app);
// http.listen(WS_PORT, () => console.log(`Express app (http) listening on host: ${WS_HOST}, port: ${WS_PORT}!`));


const http = require('http');
/**
 * There are two types of HTTP requests that can happen
 * @example     1.  In-Server Request
 * @description     * In-Server requests are made by PHP (in Apache server which runs the website) to the Real-time websocket server
 *                  * This is the only way that websocket server can get a message
 *                  * TODO: Users cannot send messages to the websocket server (Password Protect it)
 * @example 	2. 	Client-Websocket Request
 * @description		* This request initiates a websocket connection between the server and the client
 */
const server = http.createServer(function(request,response) {
	// read post paramas
	// TIP: Unlike PHP, Node.js is async
	function getPostParams(request, callback) {
	    const qs = require('querystring');

	    if (request.method == 'POST') {
	        let body = '';

	        request.on('data', function (data) {
	            body += data;

	            // Too much POST data, kill the connection!
	            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
	            if (body.length > 1e6)
	                request.connection.destroy();
	        });

	        request.on('end', function () {
	            const POST = qs.parse(body);
	            callback(POST);
	        });
	    }
	}

    // in-server request from PHP
    if (request.method === "POST") {
    	getPostParams(request, function(POST) {	
			messageClients(POST.data);
			response.writeHead(200);
			response.end();
		});
		return;
	}
});
server.listen(WS_PORT, WS_HOST, function(){
	console.log(`Server is listening on host: ${WS_HOST}, port: ${WS_PORT}!`);
});

/* 
	Handling websocket requests
*/
// @link https://github.com/theturtle32/WebSocket-Node
const WebsocketServer = require('websocket').server;

const websocketServer = new WebsocketServer({
	httpServer: server
});

websocketServer.on("request", websocketRequest);

// websockets storage
global.clients = {}; // connected clients
let connectionId = 0; // incremental unique ID for each connection (this does not decrement on close)

/** 
* This function handles the web socket request send from the client
* No response sent back
* Only accepts the connection
*/
function websocketRequest(request) {
	// TODO: Validate Hostname in Production Mode
	// TIP: You can also get query params and do different setups 

	// start the connection
	const connection = request.accept(null, request.origin);
	// increment the connections
	connectionId++;
	// save the connection for future reference
	clients[connectionId] = connection;
}

/**
 * Sends a message to all the clients
 * @param {string} message   	The message to send
 */
function messageClients(message) {
	for(const i in clients) {
		clients[i].sendUTF(message);
	}
}