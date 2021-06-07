$(document).ready(function () {

    // GAMEBOARD //
    // Les lignes 6 à 95, qui couvrent l'ensemble des fonction d'affichage du plateau de jeu Codenames, sont reprises d'un dépôt disponible publiquement (https://github.com/sirosen/codenames-js)

function updateRemainingIndicators() {
  var countBlue = document.querySelectorAll(".blueword").length;
  var countRed = document.querySelectorAll(".redword").length;
  var countBlueSelected = document.querySelectorAll(".blueword.activated").length;
  var countRedSelected = document.querySelectorAll(".redword.activated").length;

  var target = document.getElementById("blueRemaining");
  target.innerHTML = (countBlue - countBlueSelected).toString();

  target = document.getElementById("redRemaining");
  target.innerHTML = (countRed - countRedSelected).toString();
}

function clickActivates(node) {
  node.addEventListener("click", function(evt) {
    evt.stopPropagation();

    if ( clientID == currentPlayer && clientID != spyMaster ) {
        if (window.confirm("Voulez-vous choisir cette carte: " + node.innerHTML + "?")) {
        node.classList.add("activated");
        updateRemainingIndicators()

        socket.emit('clicked tile', {
            tileName: node.innerHTML
        })

        if (node.className.includes('assassin')) {
            // alert('Assassin !');
            socket.emit('murder', {
                murdered: true,
                murderedPlayer: clientID
            });
        }
     }
  }
});
}

var target = document.getElementById("wordList");
  // clear all children

  function clearBoard() {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
  }

function renderBoard(cartesNvellePartie, distribMots) {
  let listeMots = cartesNvellePartie;
  let distributionMots = distribMots;

  
  let bluewords = distributionMots[0], redwords = distributionMots[1];
   
  let assassin = distributionMots[2];

  // clear board
  clearBoard()
  
  // render the board
  var table = document.createElement("TABLE");
  for (var i = 0; i < 5; i++) {
    var tr = document.createElement("TR");
    for (var j = 0; j < 5; j++) {
      var idx = 5 * i + j;
      var td = document.createElement("TD");
      td.appendChild(document.createTextNode(listeMots[idx]));
      td.classList.add("gameword");
      if (idx == assassin) {
        td.classList.add("assassin")
      } else if (redwords.includes(idx)) {
        td.classList.add("redword")
      } else if (bluewords.includes(idx)) {
        td.classList.add("blueword")
      } else {
        td.classList.add("neutralword")
      }
      clickActivates(td);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  target.appendChild(table);
}

function renderAll(cartesNvellePartie, distribMots) {
  let firstPlayer = 'blue';
  renderBoard(cartesNvellePartie, distribMots);
  updateRemainingIndicators();
}


    // SOCKET.IO //
    /*global io*/
    let socket = io();
    let clientID = $('#player-name').text();
    let playerNbr = $('#player-nbr').text();
    let currentPlayer = '';
    let spyMaster = '';
    let firstPlayerName = '';
    let player1Color = '';
    let player2Color = '';
    let Player1HasPlayed = false;
    let Player2HasPlayed = false;

    let clue = '';
    let nbr_words = null;

    function updateStatusDisplay() {
        let action = '';

        if (Player1HasPlayed && Player2HasPlayed) {
            action = 'quand tu le souhaites, passe au tour suivant !';
        }
        else if (currentPlayer == spyMaster) {
            action = 'choisis un indice à fournir à ton partenaire !';
        }
        else {
            action = 'devine les cartes liées à l\'indice fourni !';
        }

        $('#active-player').text('A ' + currentPlayer + ' de jouer: ' + action);
    }

    function displayTiles() {
        let blueTiles = document.querySelectorAll(".blueword");
        let redTiles = document.querySelectorAll(".redword");

        if ( clientID == spyMaster ) {
            if ( clientID == firstPlayerName ) {
                blueTiles.forEach(function(tile) {
                     tile.classList.remove("spymaster");
                });

                redTiles.forEach(function(tile) {
                    tile.classList.add("spymaster");
                });
            }
            else {
                redTiles.forEach(function(tile) {
                    tile.classList.remove("spymaster");
               });

               blueTiles.forEach(function(tile) {
                   tile.classList.add("spymaster");
               });
            }
        }
    }

    $('#btn-plyr2').hide();
    $('#next-turn').hide();

    $('#quitgame').click(function() {
        socket.emit('quit game', () => {
            console.log('a player wants to quit the game');
        })
    });
    
    socket.on('redirectQuit', function(direction) {
        window.location.href = direction;
    });
    
    
    socket.on('start game', (data) => {
        clearBoard();

        
        renderAll(data.cartesNvellePartie, data.distribMots);
        
        $('#btn-plyr1').show();
        
        firstPlayerName = data.firstPlayerName;
        currentPlayer = data.currentPlayer;
        Player1HasPlayed = data.Player1HasPlayed;
        Player2HasPlayed = data.Player2HasPlayed;
        spyMaster = data.firstPlayerName;
        player1Color = data.player1Color;
        player2Color = data.player2Color;
        
        $('#player1-span').text(data.firstPlayerName)
        $('#player2-span').text(data.player2);
        
        
        $('#turns').text('Tour actuel: ' + data.turn);
        updateStatusDisplay();
        displayTiles();
        $('#active-spymaster').text('Spymaster: ' + spyMaster);

        if ( clientID == spyMaster ) {
            $('#spymaster-input').show();
            $('#guesser-display').hide();
        }
        else {
            $('#spymaster-input').hide();
            $('#guesser-display').show();
        }


    });

    $('#btn-plyr1').click(function() {
        if (currentPlayer == clientID && currentPlayer == spyMaster) {
            Player1HasPlayed = true;

            clue = $('#clue').val();
            nbr_words = $('#nbr-words').val();

            socket.emit('end P1', { Player1HasPlayed: Player1HasPlayed,
            clue: clue,
            nbr_words: nbr_words
            });
        }
    });

    $('#btn-plyr2').click(function() {
        if (currentPlayer == clientID) {
            Player2HasPlayed = true;

            socket.emit('end P2', Player2HasPlayed);
        }
    });

    $('#next-turn').click(function() {
        if (currentPlayer == clientID) {
         let remainingBlue = document.getElementById("blueRemaining").innerHTML;
         let remainingRed = document.getElementById("redRemaining").innerHTML;

            socket.emit('next turn', {
                remainingBlue: remainingBlue,
                remainingRed: remainingRed 
            });
        }
    });

    socket.on('update board', (data) => {
        if ( clientID == spyMaster ) {
            document.querySelectorAll('.gameword').forEach(function(tile) {
                if (tile.innerHTML == data.clickedTileName) {
                    tile.classList.add('activated');
                }
            });
            updateRemainingIndicators();
        }
    })

    socket.on('start P2', (data) => {
        Player1HasPlayed =  data.Player1HasPlayed;
        currentPlayer = data.currentPlayer;
        clue = data.clue;
        nbr_words = data.nbr_words;

        $('#guesser-display').text('L\'indice est ' + clue + ' en ' + nbr_words + ' mots.');
        $('#spymaster-input').hide();
        $('#guesser-display').show();

        updateStatusDisplay();

        $('#btn-plyr1').hide();

        if (clientID == currentPlayer) {
            $('#btn-plyr2').show();
        }
    })
    
    socket.on('end turn', (data) => {
        Player2HasPlayed = data.Player2HasPlayed;
        currentPlayer = data.currentPlayer;
        clue = data.clue;
        nbr_words = data.nbr_words;

        updateStatusDisplay();

        $('#next-turn').show();
        $('#btn-plyr2').hide();
    })

    socket.on('new turn', (data) => {
        $('#turns').text('Tour actuel: ' + data.turn);
        Player2HasPlayed = data.Player2HasPlayed;
        Player1HasPlayed = data.Player1HasPlayed;
        currentPlayer = data.currentPlayer;
        spyMaster = data.spyMaster;
        clue = '';
        nbr_words = null;

        $('#clue').val('');
        $('#nbr-words').val('');

        if (clientID == spyMaster) {
            $('#spymaster-input').show();
        }

        $('#guesser-display').hide();

        document.querySelectorAll(".gameword").forEach(function(tile) {
          tile.classList.remove('spymaster');  
        });
        displayTiles();
        updateStatusDisplay();
        $('#active-spymaster').text('Spymaster: ' + spyMaster);

        $('#btn-plyr1').show();
        $('#btn-plyr2').hide();
        $('#next-turn').hide();
    });

    socket.on('end game', (data) => {
        alert(data);

        socket.emit('quit game');
    })

})