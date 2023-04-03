require('dotenv').config();
require('./config/dbConfig').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');

// Routers
const authRoutes = require('./routes/auth');
const roadRoutes = require('./routes/roadmaps');
const profileRoutes = require('./routes/profile');
const User = require('./models/User');
const Chat = require('./models/Chat');

//controller
const authController = require('./controller/AuthController');
const chatController = require('./controller/ChatController');

//online users
let onlineUsers = [];

// Important constants
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 5000;

// Middle wares
app.use(express.json());
app.use('/public', express.static(path.resolve(__dirname, './public')));
app.use(express.static(path.resolve(__dirname, './client/build')));
if (process.env.NODE_ENV === 'production') {
    app.use(cors());
}
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

// Routing
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
app.use('/roadmaps', roadRoutes);

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Socket IO
io.of('/chat').use(authController.isSocketAuthenticated);

io.of('/chat').on('connect', async (socket) => {
    //online status
    socket.on('iamOnline', (data) => {
        onlineUsers.push({
            uid: data.user._id,
            socketId: socket.id,
        });
        io.of('/chat').emit('userOnlineUpdate', onlineUsers);
    });

    //join to room
    socket.on('joinRoom', (data, joined_ack) => {
        socket.join(data.room);

        //getting socket client know, they are connected to the room
        joined_ack(true);
    });

    //leave and join
    socket.on('leaveAndJoin', (data, lj_ack) => {
        // socket leave the room
        socket.leave(data.toLeave);

        // socket join the new room
        socket.join(data.toJoin);

        lj_ack(1);
    });

    //leave room
    socket.on('leaveRoom', (data, leave_ack) => {
        socket.leave(data.room);

        leave_ack(1);
    });

    //message recived
    socket.on('messageToEnd', async (data, ack) => {
        //set message to database
        try {
            let res = await chatController.sendMessage(
                data.people,
                data.message.content,
                data.message.sender
            );

            if (res) {
                io.of('/chat')
                    .to(data.people.join(''))
                    .emit('MessagefromEnd', res);
                ack(1);
            } else {
                ack(0);
            }
        } catch (e) {
            ack(0);
        }
    });

    //removing offline user from array of online user
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((onUser) => {
            if (onUser.socketId == socket.id) return 0;
            else return 1;
        });
        io.of('/chat').emit('userOnlineUpdate', onlineUsers);
    });

    //disconnecting from client request
    socket.on('forceDis', function () {
        socket.disconnect();
    });
});

// Listen at PORT
server.listen(PORT, () => {
    console.log(`Server is up at ${PORT}`);
});
