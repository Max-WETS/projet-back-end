
$(document).ready(function () {
    /*global io*/
    let socket = io();

    let userList = [];
    
    let sessionUser = $('#pseudo').text();

    socket.on('user', (data) => {
        
        $('#num-users').text(data.currentUsers + ' users online: ');

        userList = data.onlineUsers;
        // $('#random-text').empty()
        // $('#random-text').text(JSON.stringify(data.onlineUsers));

        $('#user').empty();
        for (let i=0; i<userList.length; i++) {
            let color = '';
            let firstLetter = userList[i].username[0].toUpperCase();

            $('#user').append(`<li><img alt="avatar_${userList[i].username}" class="avatar" id="avatar${i}" src="${generateAvatar(firstLetter, 'white', userList[i].avatarColor)}">  <p>` + userList[i].username + ' - victoires: ' + userList[i].score + '</p></li>');

        }

        $('#newgame').click(function() {
            if (data.currentUsers == 2) {
                socket.emit('new game', sessionUser 
                );
            }
        })

        $('#logout').click(function() {
            socket.emit('logout', sessionUser);
        })

        socket.on('redirect', function(direction) {
            window.location.href = direction;
        })

      });

      })

      function generateAvatar(
        text,
        foregroundColor = 'white',
        backgroundColor = 'black'
    ) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 25;
        canvas.height = 25;

        //draw background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        //draw text
        context.font = "15px Arial";
        context.fillStyle = foregroundColor;
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL('image/png');
    }


