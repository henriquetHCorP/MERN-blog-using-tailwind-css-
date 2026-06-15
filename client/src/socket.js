
    // import { io } from 'socket.io-client';

    // export const socket = io('http://localhost:5000', { autoConnect: false });

    // export const socket = io('https://drc-gov-social-media.onrender.com', { autoConnect: false });

    import { io } from "socket.io-client";

// Render automatically sets NODE_ENV to production
const SOCKET_URL = process.env.NODE_ENV === "production" 
  ? "https://drc-gov-social-media.onrender.com" // Replace with your Render backend URL
  : "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false // Prevents multiple socket instances spinning up early
});
