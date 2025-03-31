// Function to send messages
function sendMessage() {
  const sender = localStorage.getItem("ghostName");  // Getting the sender's code name
  const receiver = document.getElementById("toUser").value;  // Getting the receiver's name from input
  const message = document.getElementById("messageInput").value;  // Message text from input
  const timestamp = new Date().toISOString();  // Get current timestamp

  // Ensure both sender and message are provided
  if (!receiver || !message) {
    return alert("Please enter a recipient and message.");
  }

  // Add the message to the Firebase Realtime Database
  const msgRef = ref(db, 'messages');  // Reference to "messages" node in the database
  push(msgRef, {
    sender,
    receiver,
    message,
    timestamp
  })
    .then(() => {
      document.getElementById("messageInput").value = "";  // Clear the message input field
      loadMessages();  // Reload messages to display new one
    })
    .catch((error) => {
      console.error("Error sending message: ", error);  // Log any errors
    });
}
