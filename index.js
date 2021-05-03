const userInput = document.getElementById("user-input"),
	messageInput = document.getElementById("message-input");

function handleKeyUp(e) {
    if(e.keyCode === 13) {
        sendMessage();
    }
}
function sendMessage() {
    const user = userInput.value.trim(),
        message = messageInput.value.trim();

    if (!user)
        return alert("Please fill in the user");

    if (!message)
        return alert("Please write a message");

    const ajax = new XMLHttpRequest();
    ajax.open("POST", "server/send-message.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("user=" + user + "&message=" + message);

    messageInput.value = "";
}

// web sockets
try {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    const connection = new WebSocket(WS_SERVER);
    const connectingSpan = document.getElementById("connecting");
    connection.onopen = (res) => {
        connectingSpan.style.display = "none";
        console.log(res);
    };
    connection.onerror = (error) => {
        connectingSpan.innerHTML = "<span class='color-red'>[x] Error occured in the web socket server.</span><span class='hidden'>"+JSON.stringify(error)+"</span>";
        console.log(error);
    };
    connection.onmessage = (message) => {
        console.log(message);
    
        const currentUser = userInput.value.trim();
    
        const data = JSON.parse(message.data);
    
        const div = document.createElement("div");
        const author = document.createElement("span");
        author.className = "author";
        author.innerHTML = (currentUser == data.user ? '<u>'+data.user+'</u>' : data.user);
        const span = document.createElement("span");
        span.className = "messsage-text";
        span.innerHTML = data.message;
    
        div.appendChild(author);
        div.appendChild(span);
    
        document.getElementById("message-box").appendChild(div);
    };
    connection.onclose = (res) => {
        connectingSpan.style.display = "block";
        connectingSpan.innerHTML = "<span class='color-red'>[x] The web socket server accidentally closed.</span><span class='hidden'>"+JSON.stringify(res)+"</span>";
        console.log(res);
    };
} catch(error) {
    console.log(error);
}