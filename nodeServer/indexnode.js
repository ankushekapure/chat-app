// Node Server Which Will Handle SOcket IO Connections
// importing module socket.io and setting up the socket.io server on port 8000
const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

// An object to store the connected users
const users = {};
// If Someone Joins
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })


    // If Someone sends the message
    socket.on('user-sent-message', message => {
        socket.broadcast.emit('receive-message', { message: message, name: users[socket.id] });
    })

    // If Someone Gets disconnect
    socket.on('disconnect', name => {
        socket.broadcast.emit('disconnected', users[socket.id]);
        // also delete the id of disconnected user
        delete users[socket.id];
    })


});