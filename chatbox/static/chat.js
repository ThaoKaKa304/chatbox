$(document).ready(function() {
    // Lắng nghe sự kiện click vào nút Gửi
    $('#send-button').click(function() {
        var text = $('#message-text').val();
        if (text.trim() !== '') {
            sendMessage(text);
        }
        $('#message-text').val('');
    });

    // Lắng nghe sự kiện nhấn Enter để gửi tin nhắn
    $('#message-text').keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#send-button').click();
        }
    });

    // Lắng nghe sự kiện nhận tin nhắn từ server và hiển thị lên màn hình
    var socket = new WebSocket('ws://' + window.location.host + '/ws/');
    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        receiveMessage(data.sender, data.text, data.timestamp);
    };
});

// Gửi tin nhắn đến server
function sendMessage(text) {
    $.ajax({
        url: '/send/',
        type: 'POST',
        data: { 'text': text },
        dataType: 'json',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// Nhận tin nhắn mới và hiển thị lên màn hình
function receiveMessage(sender, text, timestamp) {
    var message = '<div class="message"><span class="sender">' + sender + '</span><span class="text">' + text + '</span><span class="timestamp">' + timestamp + '</span></div>';
    $('.chat-messages').append(message);
    $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
}