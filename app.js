const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// just serve the uploads folder as a normal page
app.use(
  "/uploads",
  express.static(path.join(path.resolve(), "uploads"))
)

// Set up a WebSocket server
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);
  console.log('A new WebSocket client connected');
  ws.on('close', function close() {
    clients.delete(ws);
  });

  // only for text messages
  ws.on('message', function incoming(message) {
    // all of this parsing and stringifying is because websockets
    // only wants to send strings or buffers and will crash if
    // it's not in the format it expects
    const _m = JSON.parse(message);
    console.log("text is:", JSON.stringify(_m));
    broadcastMessage(JSON.stringify(_m));
  });

  ws.send(JSON.stringify({welcome: 'Welcome to the WebSocket server!'}));
});

// Handle file upload
app.post('/uploads', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
  const fileName = req.file.originalname;
  // console.log("sending file name:", req.file.originalname);
  const _m = {
    file: req.file.originalname
  }
  console.log("file is:", _m);
  broadcastMessage(JSON.stringify(_m));
});

function broadcastMessage(message) {
  for (let client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
  }
}

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
