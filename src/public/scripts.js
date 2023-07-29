const socket = io();

// Join Room Form Submission
const joinRoomForm = document.getElementById("joinRoomForm");
joinRoomForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(joinRoomForm);
  const roomId = formData.get("roomId");
  const useremail = formData.get("useremail");
  // Emitting 'joinRoom' event to the server
  socket.emit("joinRoom", roomId, useremail);
  const joinRoomSuccess = document.getElementById("joinRoomSuccess");
  joinRoomSuccess.innerHTML += `<p>You successfully joined room: ${roomId}</p>`;
});

// Send Message Form Submission
const sendMessageForm = document.getElementById("sendMessageForm");

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(sendMessageForm);
  const message = formData.get("message");
  const roomId = formData.get("roomId");
  const username = formData.get("username");
  // Emitting 'sendMessage' event to the server
  socket.emit("sendMessage", { roomId, message, username });

  // Clearing the input field after sending the message
  sendMessageForm.reset();
});

// Receive Messages from the Server
socket.on("receiveMessage", (data) => {
  const { message, username } = data;
  // Displaying the received message in the chatMessages div
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML += `<p><strong>${username}: </strong>${message}</p>`;
});
