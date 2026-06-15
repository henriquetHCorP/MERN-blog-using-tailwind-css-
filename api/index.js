import express from 'express'; 
import mongoose from 'mongoose'; 
import dotenv from 'dotenv'; 
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js'; 
import commentRoutes from './routes/comment.route.js'; 
import cookieParser from 'cookie-parser'; 
import path from 'path'; 

import http from 'http';
import { Server } from 'socket.io';
import { createServer } from "http";


dotenv.config(); 

mongoose
.connect(process.env.MONGO)
.then(() => {
    console.log('MongoDb is connected');
})
.catch((err) => {
    console.log(err); 
}); 

const __dirname = path.resolve(); 

const app = express();

//const http = require('http');
//const { Server } = require('socket.io');


const httpServer = createServer(app);
// Allow both localhost and your production Render URL
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL // Set this environment variable in Render dashboard
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Export io to use inside your Post controllers
export { io };

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Socket Server running on port ${PORT}`));
 
app.use(express.json()); 
app.use(cookieParser());
app.listen(3000, () => {
    console.log('Server is running on port 3000!'); 
}); 

app.use('/api/user', userRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes); 
app.use('/api/post', commentRoutes); 
app.use('/api/comment', commentRoutes); 

app.use(express.static(path.join(__dirname, 'client/dist'))); 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')); 
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    const message = err.message || 'Internal Server Error'; 
    res.status(statusCode).json({
        success: false, 
        statusCode, 
        message, 
    }); 
}); 


