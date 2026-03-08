import { io } from 'socket.io-client';

// Adjust the URL if your backend runs elsewhere.
export const socket = io('http://localhost:5000', {
  autoConnect: false
});

