'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const MongoStore = require('connect-mongo');
const URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const { Server } = require('socket.io');
const io = new Server(http);
const passportSocketIo = require('passport.socketio');
const gameController = require('./gameController');
const debug = require('debug')('user');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cookieParser());
app.use(morgan('combined'));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  key: 'express.sid',
  store: MongoStore.create({ mongoUrl: URI })
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useCreateIndex', true);
const User = require('./models/user');
const { update } = require('./models/user');
passport.use(new Strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: URI }),
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
  );
  
  
let listOnlineUsers = [];
let sessionUserID = null;
let firstPlayerName = '';
let player1Color = 'blue';
let player2 = '';
let player2Color = 'red';
let spyMaster = '';
let currentPlayer = '';
let Player1HasPlayed = false;
let Player2HasPlayed = false;
let turn = 1;
const max_turns = 9;
let clue = '';
let nbr_words = null;

let MOTS = gameController.MOTS;
let LIMITE = gameController.LIMITE;

function findActivePlayer() {
  if ( currentPlayer == '' || currentPlayer == player2 ) {
    currentPlayer = firstPlayerName;
  } else {
    currentPlayer = player2;
  }
}

function switchSpyMaster() {
  if (turn % 2 != 0) {
    spyMaster = firstPlayerName;
  }
  else {
    spyMaster = player2;
  }
}

function updateUserDB(filter, field, update) {
  User.findOneAndUpdate(filter, update, { new: true }).then(doc => {
    if (!doc) { console.dir('score update didn\'t work'); }
    console.dir(`Le champ ${field} de ${doc.username} est maintenant égal à: ${doc[field]}.`);
  })
}

async function updateScore(player) {
  let filter = { username: player };
  let update = { $inc: { score: 1 } };

  let doc = await updateUserDB(filter, 'score', update);
}
  
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  const client = new MongoClient(URI, options);
  const conn = mongoose.connect(URI, options);
  const connection = mongoose.connection;
  
  // Register routes
  app.use('/', require('./routes'));
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

      // SOCKET.IO
     let currentUsers = 0;
     io.on('connection', socket => {
      console.dir('A user has connected: ' + socket.request.user.username);
      ++currentUsers;

      if ( listOnlineUsers.find(user => user.username == socket.request.user.username) == null ) {
      User.findOne({ username: socket.request.user.username }, function(err, user) {
      if (err) { console.log('pas d\'utilisateur trouvé')};
      console.dir('user found / name: ' + user.username + ' - score: ' + user.score);

      listOnlineUsers.push({
        username: user.username,
        score: user.score,
        avatarColor: user.avatar
      });
      console.dir('liste connexion: ' + JSON.stringify(listOnlineUsers));
      io.emit('user', {
        currentUsers,
        onlineUsers: listOnlineUsers
        });
      })
    }
        

     io.emit('user', {
      name: socket.request.user.username,
      currentUsers,
      connected: true,
      onlineUsers: listOnlineUsers
    });

    socket.on('new game', (data) => {
    
      firstPlayerName = data;
      currentPlayer = firstPlayerName;
      console.dir('1st Player: ' + firstPlayerName);
      for (let user of listOnlineUsers) {
        if (user.username != firstPlayerName) player2 = user.username;
      }

      Player1HasPlayed = false;
      Player2HasPlayed = false;

      // findActivePlayer();
      switchSpyMaster();

      console.dir('first player\'s name: ' + data + ' / ' + 'second player\'s name: ' + player2);
      const directionGame = '/menu/game';

      io.emit('redirect', directionGame);

      turn = 1;
      
    })

    console.dir(firstPlayerName);
    io.emit('start game', {
      firstPlayerName: firstPlayerName,
      player2: player2,
      turn: turn,
      currentPlayer: currentPlayer,
      Player1HasPlayed: Player1HasPlayed,
      Player2HasPlayed: Player2HasPlayed,
      spyMaster: spyMaster,
      player1Color: player1Color,
      player2Color: player2Color,

      cartesNvellePartie: gameController.cartesNvellePartie(LIMITE, MOTS.length),
      distribMots: gameController.distribMots(LIMITE)

    });
    

    socket.on('end P1', (data) => {
      Player1HasPlayed = data.Player1HasPlayed;
      clue = data.clue;
      nbr_words = data.nbr_words;

      findActivePlayer();

      io.emit('start P2', {
        Player1HasPlayed: Player1HasPlayed,
        currentPlayer: currentPlayer,
        clue: clue,
        nbr_words: nbr_words
      });
    });

    socket.on('clicked tile', (data) => {
      console.dir(data.tileName);
      io.emit('update board', {
        clickedTileName: data.tileName
      })
    })

    socket.on('end P2', (data) => {
      Player2HasPlayed = data;

      clue = '';
      nbr_words = null;

      findActivePlayer();

      io.emit('end turn', {
        Player2HasPlayed: Player2HasPlayed,
        currentPlayer: currentPlayer,
        clue: clue,
        nbr_words: nbr_words
      });
    });

    socket.on('next turn', (data) => {
      findActivePlayer();
      
      Player1HasPlayed = false;
      Player2HasPlayed = false;
      turn++;
      switchSpyMaster();

      if (turn == max_turns ) {
        let endMessage = '';

        if ( data.remainingBlue == data.remainingRed ) {
          endMessage = 'match nul';
        }
        else if (data.remainingBlue > data.remainingRed ) {
          endMessage = 'le joueur 2 a gagné';
          updateScore(player2);
        }
        else {
          endMessage = 'le joueur 1 a gagné';
          updateScore(firstPlayerName);
        }

        console.dir(endMessage);

        io.emit('end game', endMessage);
      }

      else {
        io.emit('new turn', { 
          Player2HasPlayed: Player2HasPlayed, 
          Player1HasPlayed: Player1HasPlayed, 
          turn: turn, 
          currentPlayer: currentPlayer,
          spyMaster: spyMaster 
        });
      }
    })

    socket.on('murder', async (data) => {
      let endMessage = '';

      if ( data.murdered ) {
        let nbr = data.murderedPlayer = firstPlayerName ? 1 : 2;
        nbr == 1 ? await updateScore(firstPlayerName) : await updateScore(player2);
        endMessage = `Vous êtes tombé sur une carte assassin ! le joueur ${nbr} a gagné`;
        console.dir(endMessage);
        
        io.emit('end game', endMessage);
      }

    })
    
    socket.on('quit game', () => {
      console.dir('a player quit the game');
      firstPlayerName = '';
      const directionQuitGame = '/menu';
      currentPlayer = '';
      spyMaster = '';

      io.emit('redirectQuit', directionQuitGame);
    })

    socket.on('disconnect', () => {
      console.dir('A user has disconnected: ' + socket.request.user.username);
      --currentUsers;
      
      if ( listOnlineUsers.find(user => user.username == socket.request.user.username) != null ) {
        let idx = null;
        for (let i = 0; i < listOnlineUsers.length; i++) { if (listOnlineUsers[i].username == socket.request.user.username) idx = i }
        listOnlineUsers.splice(idx, 1);
        }
        console.dir(listOnlineUsers);

      io.emit('user', {
        name: socket.request.user.username,
        currentUsers,
        connected: false,
        onlineUsers: listOnlineUsers
      });

    });
  });

  function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
  
    accept(null, true);
  }
  
  function onAuthorizeFail(data, message, error, accept) {
    if (error) throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
  }
  
  http.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  });
  
  
  
  