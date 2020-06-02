const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let {generateMessage, generateEncryptMessage} = require("./utils/message-helper.js");
let {isRealString} = require("./utils/text-helper.js");
const {Users} = require("./models/users.js");


//set port
const PORT = 5555;

let app = express();
let httpServer = http.createServer(app);
let io = socketIO(httpServer);
let users = new Users();


io.on('connection', (socket) => {
  console.log('new user connected to server', socket.id);


  socket.on('join-room', (params, callback) => {
    console.log('join-room received by server', params);
    let joinData = {
      room: undefined,
      name: undefined,
      err: undefined
    };

    if (!isRealString(params.name) || !isRealString(params.room)) {

      joinData.err = 'name and room name must not be empty';
      return callback(joinData);
    }

    socket.join(params.room);
    users.removeUser(socket.id)//remove from room
    users.addUser(socket.id, params.name, params.room);


    joinData.room = params.room;
    joinData.name = params.name;

    if (callback) {
      callback(joinData);
    }

    io.to(params.room).emit('update-user-list', users.getUserList(params.room));

    //send to socket only
    socket.emit('new-message', generateEncryptMessage('admin', 'welcome to the chat app'));

    //send to all in the room but myself
    socket.broadcast.to(params.room).emit('new-message', generateEncryptMessage('admin', `${joinData.name} has joined this room`));


  });


  socket.on('create-message', (createdMessage, callback) => {
    console.log('create-message received by server', JSON.stringify(createdMessage, undefined, 2));

    let user = users.getUser(socket.id);

    if (user && isRealString(createdMessage.text)) {
      //io.emit , send create-message to all connected users
      io.to(user.room).emit('new-message', generateMessage(user.name, createdMessage.text));
    }

    //acknowledge receiving by calling  callback
    if (callback) {
      callback();
    }

  });


  function removeUser(socketid) {
    let removedUser = users.removeUser(socketid);

    if (removedUser) {
      io.to(removedUser.room).emit('update-user-list', users.getUserList(removedUser.room));
      socket.broadcast.emit('new-message', generateEncryptMessage('admin', `${removedUser.name} has left the room`));
    }
    return removedUser;
  }

  socket.on('leave-room', (params, callback) => {

    let foundUser = removeUser(socket.id);
    if (callback) {
      callback(foundUser);
    }
    console.log('user has left room ', foundUser);
  });

  socket.on('disconnect', () => {

    removeUser(socket.id);
    console.log('user disconnect from server', socket.id);

  });

});


httpServer.listen(PORT, () => {
  console.log(`server is up on port ${PORT}`)
});

