
$(document).ready(function () {
    /*global io*/
    let socket = io();

    let userList = [];
    
    let sessionUser = $('#pseudo').text();

    socket.on('user', (data) => {
        
        $('#num-users').text(data.currentUsers + ' users online: ');

        userList = data.onlineUsers;
        $('#user').empty();
        for (let i=0; i<userList.length; i++) {
            $('#user').append('<li>' + userList[i].username + ' - victoires: ' + userList[i].score + '</li>');
        }

        $('#newgame').click(function() {
            if (data.currentUsers == 2) {
                socket.emit('new game', sessionUser 
                );
            }
        })

        socket.on('redirect', function(direction) {
            window.location.href = direction;
        })

      });


});