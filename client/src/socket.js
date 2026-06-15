// src/socket.js
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', { autoConnect: false });

    // export const socket = io('https://drc-gov-social-media.onrender.com', { autoConnect: false });
