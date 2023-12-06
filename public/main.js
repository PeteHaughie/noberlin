const socket = io();

const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value
  });
  inputField.value = "";
});

socket.on("chat message", function (data) {
    socket.emit({ message: data.message });
});
