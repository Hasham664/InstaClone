import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://insta-clone-dmvc.vercel.app'],
    methods: ['GET', 'POST'],
  },
});


const userSocketMap = {};
console.log('userSocketMap now:', userSocketMap);

// export const GetReciverSocketId = (reciverId) => userSocketMap[reciverId] || null;
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId] || null;


io.on('connection', (socket) => {
 const userId = socket.handshake.query.userId;
 if(userId) {
  userSocketMap[userId] = socket.id;
  console.log('user connected userId', userId);
 }
 io.emit('getOnlineUsers', Object.keys(userSocketMap));
    socket.on('disconnect', () => {
      if(userId) {
          console.log('user disconnected userId', userId);
        delete userSocketMap[userId];
      }
       io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

export { io, app, server };