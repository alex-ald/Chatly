jQuery(function ($) {
    console.log("Running custom Javascript...");
    
    var $mainBox = $('.mainBox');
    $mainBox.hide();
    
    var socket = io.connect();
    var $messageBox = $('.messageBox input');
    var $textContainer = $('.chatlyBox ul');
    var $chatBox = $('.chatlyBox');
    var $chatlyContainer = $('.chatlyContainer');
    
    var $usernameBox = $('.nameEntry input');
    var $usernameForm = $('.nameForm');
    var $errorMsgUsername = $('.errorMsgUsername');
    
    // SOCKET.IO CONFIGURATIONS //
    $chatlyContainer.submit(function (e) {
        e.preventDefault();
        console.log("Sending message...");
        if($messageBox.val() !== '') {
	        socket.emit('send message', {user: socket.username, msg: $messageBox.val()});
	        $textContainer.append('<li class="well outTextBox">' + '<b>' + socket.username + '</b> - '
	        	+ $messageBox.val() + '<br/>' + '<p class="messageTime">' + new Date().toLocaleString() + '</p>' + '</li>');
        	$messageBox.val("");
        	$chatBox.animate({
        		scrollTop: $chatBox[0].scrollHeight
        		}, 500);
    	}

    });
    socket.on('new message', function (data) {
        $textContainer.append('<li class="well inTextBox">' + '<b>' + data.user + '</b> - '
        	+ data.msg + '<br/>' + '<p class="messageTime">' + new Date().toLocaleString() + '</p>' + '</li>');
    	$chatBox.animate({
    		scrollTop: $chatBox[0].scrollHeight
    		}, 500);
    });
        // CONFIRM USERNAME
    $usernameForm.submit(function (e) {
        e.preventDefault();
        console.log('Checking username...');
        socket.emit('new user', $usernameBox.val(), function (reply) {
        	console.log(reply);
            if(reply) { // username was accepted
                $mainBox.show();
                $errorMsgUsername.slideUp();
                $('.nameSelectionBox').fadeOut();
                socket.username = $usernameBox.val();
                console.log('Username changed: ' + socket.username);
            } 
            else { // username was declined
                console.log('username is taken or unavailable');
                // Display Error message
                $errorMsgUsername.slideDown();
            }
        });
    });
});