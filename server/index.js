const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// In-memory room store. For production you might back this with MongoDB.
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ roomId }) => {
    if (!roomId) return;

    let room = rooms.get(roomId);
    if (!room) {
      room = new Set();
      rooms.set(roomId, room);
    }

    if (room.size >= 2) {
      socket.emit('room-full');
      return;
    }

    room.add(socket.id);
    socket.join(roomId);

    if (room.size === 1) {
      socket.emit('created', { roomId });
    } else if (room.size === 2) {
      socket.emit('joined', { roomId });
      socket.to(roomId).emit('ready', { roomId });
      socket.emit('ready', { roomId });
    }

    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ roomId, answer }) => {
    if (!roomId || !answer) return;
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  socket.on('chat-message', ({ roomId, message, sender }) => {
    if (!roomId || !message) return;
    io.to(roomId).emit('chat-message', { message, sender, timestamp: new Date().toISOString() });
  });

  socket.on('leave-room', ({ roomId }) => {
    if (!roomId) return;
    leaveRoom(socket, roomId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const [roomId, room] of rooms.entries()) {
      if (room.has(socket.id)) {
        leaveRoom(socket, roomId);
      }
    }
  });
});

function leaveRoom(socket, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(socket.id);
  socket.leave(roomId);
  socket.to(roomId).emit('peer-left');

  if (room.size === 0) {
    rooms.delete(roomId);
  }

  console.log(`Socket ${socket.id} left room ${roomId}`);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`PEERLINK signaling server listening on port ${PORT}`);
});

