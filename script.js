// Firebase SDK setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Save user info to localStorage for login
function saveSetup() {
  const codeName = document.getElementById("codeName").value;
  const pin = document.getElementById("setPIN").value;

  if (pin.length !== 4 || !codeName) {
    return alert("Set a 4-digit PIN and code name.");
  }

  // Save PIN and code name to localStorage (for login purposes)
  localStorage.setItem("ghostPIN", pin);
  localStorage.setItem("ghostName", codeName);
  
  console.log("Saved PIN:", pin);
  console.log("Saved Code Name:", codeName);

  // Hide the setup form and show the login form
  document.getElementById("setup").style.display = "none";
  document.getElementById("login").style.display = "block";
}

// Verify PIN and proceed to the app
function verifyPIN() {
  const input = document.getElementById("pinInput").value;
  const realPIN = localStorage.getItem("ghostPIN");
  const status = document.getElementById("loginStatus");

  if (input === realPIN) {
    openApp();
  } else if (input === realPIN.split("").reverse().join("")) {
    status.innerText = "Ghost Spoof Mode Enabled.";
    openApp(true);
  } else {
    status.innerText = "Incorrect PIN.";
  }
}

// Open the app after login
function openApp(spoof = false) {
  document.getElementById("login").style.display = "none";
  document.getElementById("appUI").style.display = "block";
  document.getElementById("userTag").innerText = `Welcome, ${localStorage.getItem("ghostName")}`;

  if (spoof) {
    document.getElementById("messaging").innerHTML = "<p>Secure messaging unavailable.</p>";
  } else {
    loadMessages();
  }
}

// Handle sending messages
function sendMessage() {
  const sender = localStorage.getItem("ghostName");
  const receiver = document.getElementById("toUser").value;
  const message = document.getElementById("messageInput").value;
  const timestamp = new Date().toISOString();

  if (!receiver || !message) return alert("Fill out all fields");

  const msgRef = ref(db, "messages");
  push(msgRef, {
    sender,
    receiver,
    message,
    timestamp
  });

  document.getElementById("messageInput").value = "";
}

// Load messages from Firebase
function loadMessages() {
  const thread = document.getElementById("messageThread");
  thread.innerHTML = "";
  const ghost = localStorage.getItem("ghostName");

  const msgRef = ref(db, "messages");
  onChildAdded(msgRef, (snapshot) => {
    const data = snapshot.val();
    if (
      (data.sender === ghost && data.receiver === document.getElementById("toUser").value) ||
      (data.receiver === ghost && data.sender === document.getElementById("toUser").value)
    ) {
      const msg = document.createElement("div");
      msg.textContent = `${data.sender}: ${data.message}`;
      thread.appendChild(msg);
    }
  });
}
