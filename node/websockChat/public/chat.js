window.onload = function() {
    var socket = io.connect;

    socket.on('connect', function() {
        //通过join事件发送昵称
        socket.emit('join', promt('what is your nickname'))
        //show window
        document.getElementById('chat').style.display = 'block';

        socket.on('announcement', function(msg) {
            var li = document.createElement('li');
            li.className = 'announcement',
            li.innerHTML = msg;
            document.getElementById('msssages').appendChild(li)
        })
    })

    function addMessage(from, text) {
        var li = document.createElement('li');
        li.className = 'message';
        li.innerHTML = '<br>' + form + '</br>:' + text;
        document.getElementById('messages').appendChild(li);
    }


    var input = document.getElementById('input');
    document.getElementById('form').onsubmit = function() {
        addMessage('me', input.value);
        socket.emit('text', input.value);

        //resume input
        input.value = '';
        input.focus();

        return false;

    }

    socket.on('text', addMessage);

}

