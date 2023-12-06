const express = require("express");
const socket = require("socket.io");
const path = require('path');
const fs = require('fs');

// App setup
const PORT = 9000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = require('socket.io')(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

const activeUsers = new Set();

io.on("connection", function (socket) {

  // handle text
  socket.on("text-message", function (data) {
    io.emit("text-message", data);
  });

  // listen to text just in case
  socket.on("text-message", (...args) => {
    console.log(args);
  });

  // handle files
  socket.on('file-message', function (name, buffer) {
    // Use path.join for proper path resolution
    var filePath = path.join(__dirname, 'uploads', name);
  
    // Using writeFile which is simpler for this use case
    fs.writeFile(filePath, buffer, function(err) {
      if (err) {
        console.error('Error saving file:', err);
        return;
      }
      console.log('File saved successfully!');
    });
  });  

  // listen to file just in case
  socket.on("file-message", (...args) => {
    console.log("Filename:", args[0]);
  });

});
