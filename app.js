const express = require("express");
const socket = require("socket.io");

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
        origin: "http://localhost:8100",
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

  // handle files
  socket.on('file-message', function(name, buffer) {
    var fs = require('fs');

    //path to store uploaded files (NOTE: presumed you have created the folders)
    var fileName = __dirname + '/uploads/' + name;
    fs.open(fileName, 'a', 0755, function(err, fd) {
        if (err) throw err;

        fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
            fs.close(fd, function() {
                console.log('File saved successful!');
            });
        })
    });
  });
  
});
