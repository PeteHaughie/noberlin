const socket = io();
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");

var filesUpload = null;
var file = null;

if (window.File && window.FileReader && window.FileList) {
  //HTML5 File API ready
  init();
} else {
  //TODO
}

function init() {
  // FILE UPLOAD FEATURE
  filesUpload = document.getElementById('input-files');
  filesUpload.addEventListener('change', fileHandler, false);
}

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // send file if selected
  sendFile();

  if (!inputField.value) {
    return;
  }

  socket.emit("text-message", {
    message: inputField.value
  });
  inputField.value = "";
});

socket.on("text-message", function (data) {
    socket.emit({ message: data.message });
});

function fileHandler(e) {
  var files = e.target.files || e.dataTransfer.files;

  if (files) {
      //send only the first one
      file = files[0];
  }
}

function sendFile() {
  if (file) {
    //read the file content and prepare to send it
    var reader = new FileReader();

    reader.onload = function(e) {
        console.log('Sending file...');
        //get all content
        var buffer = e.target.result;
        //send the content via socket
        socket.emit('file-message', file.name, buffer);
    };
    reader.readAsBinaryString(file);
  }
}