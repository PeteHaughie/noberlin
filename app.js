
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

const io = require('socket.io')(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true,
    maxHttpBufferSize: 1e8 // 100MB
});

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle file upload
app.post('/uploads', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle socket events
  socket.on('text-message', (...args) => {
    console.log(args);
  });

  // Handle socket events
  socket.on('file-message', (...args) => {
    console.log(args);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
