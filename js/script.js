const url = 'http://students.a-level.com.ua:10012';


let lastId = 0;

async function sendMessage(nick, message) {
    await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: JSON.stringify({
            func: "addMessage",
            nick: nick,
            message: message
        })
    })
}

async function getMessages() {
    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: JSON.stringify({
            func: "getMessages",
            messageId: lastId
        })
    })
    .then(response => {
        return response.json()  
    })
    .then(response => {
        lastId = response.nextMessageId
        return response.data
    })
    .then(response => {
        response.forEach(function(response) {
        let time = new Date(response.timestamp);
        let mess = `${response.nick}: ${response.message}`;
        let tim = `${time.getHours()}:${time.getMinutes()}`;
        createMessage(mess, tim);
      })
    })
}

getMessages();

function createMessage(content, time) {
    let message = document.createElement('div');
    message.className = "oneMessage";
    let text = document.createElement('div');
    text.innerText = content;
    let tim = document.createElement('div');
    tim.className = "timeSend";
    tim.innerText = time;
    message.appendChild(text);
    message.appendChild(tim);
    document.getElementById('chat').prepend(message);

}

async function sendAndCheck(name, letter) {
    await sendMessage(name, letter);
    getMessages();
    document.getElementById('message').value = "";
}

document.getElementById('send').onclick = () => sendAndCheck(
    document.getElementById('nick').value,
    document.getElementById('message').value
);

setInterval(() => getMessages(), 5000);



